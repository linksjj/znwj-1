package com.hengyi.japp.znwj.application;

import com.google.inject.ImplementedBy;
import com.hengyi.japp.znwj.application.internal.SilkInfoServiceImpl;
import com.hengyi.japp.znwj.domain.SilkInfo;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.Collection;

/**
 * @author jzb 2019-11-21
 */
@ImplementedBy(SilkInfoServiceImpl.class)
public interface SilkInfoService {

    Mono<SilkInfo> preapareDetectData(SilkInfo silkInfo, Path imgPath);

    Collection<SilkInfo> list();

    Path detectDir(String code);

    SilkInfo find(String code);

    void start();

    void stop();
}
