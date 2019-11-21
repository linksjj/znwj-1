package com.hengyi.japp.znwj.interfaces.plc.internal;

import com.google.common.collect.Maps;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.google.inject.name.Named;
import com.hengyi.japp.znwj.application.BackendService.Status;
import com.hengyi.japp.znwj.domain.SilkInfo;
import com.hengyi.japp.znwj.interfaces.plc.PlcService;
import com.hengyi.japp.znwj.verticle.BackendVerticle;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.Map;

import static com.hengyi.japp.znwj.application.BackendService.Status.*;
import static java.util.Optional.ofNullable;

/**
 * @author jzb 2019-11-20
 */
@Slf4j
@Singleton
public class PlcServiceImpl implements PlcService {
    private final Vertx vertx;
    private Status status = INIT;
    private Date startDateTime;
    private Throwable error;

    @Inject
    private PlcServiceImpl(Vertx vertx, @Named("plcConfig") JsonObject plcConfig) {
        this.vertx = vertx;
    }

    @Override
    public void nextRfidNum(int rfidNum) {
        vertx.eventBus().send(BackendVerticle.NEXT_RFID_NUM, rfidNum);
    }

    @Override
    public Mono<SilkInfo> handleEliminate(SilkInfo silkInfo) {
        if (silkInfo.isEliminateHandled() || !silkInfo.hasException()) {
            return Mono.just(silkInfo);
        }
        // fixme 处理剔除信息
        log.debug("{}  剔除", silkInfo);
        return Mono.just(silkInfo);
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
