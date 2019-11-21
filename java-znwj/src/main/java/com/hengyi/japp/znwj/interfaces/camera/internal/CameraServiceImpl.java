package com.hengyi.japp.znwj.interfaces.camera.internal;

import com.github.ixtf.japp.codec.Jcodec;
import com.google.common.collect.Maps;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import com.hengyi.japp.znwj.application.BackendService;
import com.hengyi.japp.znwj.interfaces.camera.CameraService;
import io.vertx.core.json.JsonObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.Date;
import java.util.Map;

import static com.hengyi.japp.znwj.application.BackendService.Status.*;
import static java.util.Optional.ofNullable;

/**
 * @author jzb 2019-11-21
 */
@Slf4j
@Singleton
public class CameraServiceImpl implements CameraService {
    private BackendService.Status status = INIT;
    private Date startDateTime;
    private Throwable error;

    @Inject
    private CameraServiceImpl(@Named("cameraConfig") JsonObject cameraConfig) {
    }

    @Override
    public Mono<Path> fetch() {
        return Mono.fromCallable(() -> {
            // fixme 照片生成
            final String dir = Jcodec.uuid58();
            final Path path = Path.of("/tmp", dir);
            FileUtils.forceMkdir(path.toFile());
            return path;
        });
    }

    @Override
    public Mono<Map<String, Object>> info() {
        return Mono.fromCallable(() -> {
            final Map<String, Object> map = Maps.newHashMap();
            map.put("status", status);
            map.put("startDateTime", startDateTime);
            ofNullable(error).map(Throwable::getMessage).ifPresent(it -> map.put("errorMessage", it));
            return map;
        });
    }

    @Override
    public Mono<Map<String, Object>> start() {
        return Mono.fromCallable(() -> {
            return null;
        }).doOnSuccess(it -> {
            status = RUNNING;
            startDateTime = new Date();
            error = null;
        }).doOnError(e -> {
            status = ERROR;
            error = e;
        }).then(info());
    }

    @Override
    public Mono<Map<String, Object>> stop() {
        return Mono.fromCallable(() -> {
            return null;
        }).doOnSuccess(it -> {
            status = STOPPED;
            error = null;
        }).doOnError(e -> {
            status = ERROR;
            error = e;
        }).then(info());
    }
}
