package com.hengyi.japp.znwj.interfaces.detect;

import com.google.inject.ImplementedBy;
import com.hengyi.japp.znwj.domain.SilkInfo;
import com.hengyi.japp.znwj.interfaces.detect.internal.DetectServiceImpl;
import io.vertx.mqtt.MqttEndpoint;
import reactor.core.publisher.Mono;

import java.util.Map;

/**
 * @author jzb 2019-11-20
 */
@ImplementedBy(DetectServiceImpl.class)
public interface DetectService {

    Mono<SilkInfo> detect(SilkInfo silkInfo);

    void handler(MqttEndpoint endpoint);

    Mono<Map<String, Object>> info();

    Mono<Map<String, Object>> start();

    Mono<Map<String, Object>> stop();
}
