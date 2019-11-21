package com.hengyi.japp.znwj.interfaces.rest;

import com.github.ixtf.vertx.JvertxOptions;
import com.google.inject.Inject;
import com.hengyi.japp.znwj.application.BackendService;
import reactor.core.publisher.Mono;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.Map;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

/**
 * @author jzb 2019-11-20
 */
@Path("api/backend")
@Produces(APPLICATION_JSON)
public class BackendResource {
    private final BackendService backendService;

    @Inject
    private BackendResource(BackendService backendService) {
        this.backendService = backendService;
    }

    @Path("info")
    @GET
    public Mono<Map<String, Object>> info() {
        return backendService.info();
    }

    @JvertxOptions(timeout = 60 * 60 * 1000)
    @Path("start")
    @PUT
    public Mono<Map<String, Object>> start() {
        return backendService.start();
    }

    @JvertxOptions(timeout = 60 * 60 * 1000)
    @Path("stop")
    @PUT
    public Mono<Map<String, Object>> stop() {
        return backendService.stop();
    }
}
