package com.hengyi.japp.znwj.interfaces.camera;

import com.google.inject.ImplementedBy;
import com.hengyi.japp.znwj.interfaces.camera.internal.CameraServiceImpl;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.Map;

/**
 * @author jzb 2019-11-21
 */
@ImplementedBy(CameraServiceImpl.class)
public interface CameraService {

    Mono<Path> fetch();

    Mono<Map<String, Object>> info();

    Mono<Map<String, Object>> start();

    Mono<Map<String, Object>> stop();

}
