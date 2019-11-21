package com.hengyi.japp.znwj.application.internal;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.github.benmanes.caffeine.cache.RemovalCause;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import com.hengyi.japp.znwj.Constant;
import com.hengyi.japp.znwj.application.SilkInfoService;
import com.hengyi.japp.znwj.domain.SilkInfo;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collection;

import static com.github.ixtf.japp.core.Constant.YAML_MAPPER;
import static com.hengyi.japp.znwj.Constant.DETECT_DIR;
import static com.hengyi.japp.znwj.Constant.ORIGINAL_DIR;

/**
 * @author jzb 2019-11-21
 */
@Slf4j
@Singleton
public class SilkInfoServiceImpl implements SilkInfoService {
    private final Path dbPath;
    private final LoadingCache<String, SilkInfo> silkCache;

    @Inject
    private SilkInfoServiceImpl(@Named("silkCacheSpec") String spec, @Named("dbPath") Path dbPath) {
        this.dbPath = dbPath;
        silkCache = Caffeine.from(spec).removalListener((String key, SilkInfo value, RemovalCause cause) -> {
            saveDisk(value);
        }).build(code -> {
            final Path path = silkFile(code);
            if (Files.exists(path)) {
                return YAML_MAPPER.readValue(path.toFile(), SilkInfo.class);
            }
            final SilkInfo silkInfo = new SilkInfo();
            silkInfo.setCode(code);
            return silkInfo;
        });
    }

    private Path silkFile(String code) {
        return dbPath.resolve(code).resolve(Constant.SILK_INFO_YML);
    }

    @SneakyThrows(IOException.class)
    private void saveDisk(SilkInfo silkInfo) {
        final File silkFile = silkFile(silkInfo.getCode()).toFile();
        FileUtils.forceMkdirParent(silkFile);
        YAML_MAPPER.writeValue(silkFile, silkInfo);
    }

    private Path originalDir(String code) {
        return silkFile(code).getParent().resolve(ORIGINAL_DIR);
    }

    @Override
    public Path detectDir(String code) {
        return silkFile(code).getParent().resolve(DETECT_DIR);
    }

    @Override
    public SilkInfo find(String code) {
        return silkCache.get(code);
    }

    @Override
    public Collection<SilkInfo> list() {
        return silkCache.asMap().values();
    }

    /**
     * detect数据准备，弄成格式固定的目录结构
     *
     * @param silkInfo 北自所获取的丝锭信息数据
     * @param imgPath  摄像头抓取数据，原始图片数据
     */
    public Mono<SilkInfo> preapareDetectData(SilkInfo silkInfo, Path imgPath) {
        return Mono.fromCallable(() -> {
            final File originalDir = originalDir(silkInfo.getCode()).toFile();
            FileUtils.forceMkdirParent(originalDir);
            FileUtils.moveDirectory(imgPath.toFile(), originalDir);
            silkCache.put(silkInfo.getCode(), silkInfo);
            return silkInfo;
        });
    }

    @Override
    public void start() {
        silkCache.cleanUp();
    }

    @Override
    public void stop() {
        silkCache.asMap().values().forEach(this::saveDisk);
        silkCache.cleanUp();
    }
}
