package com.hengyi.japp.znwj.interfaces.rest;

import com.google.inject.Inject;
import com.hengyi.japp.znwj.application.SilkInfoService;
import com.hengyi.japp.znwj.domain.SilkInfo;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.Collection;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

/**
 * @author jzb 2019-11-20
 */
@Path("api/silks")
@Produces(APPLICATION_JSON)
public class SilkResource {
    private final SilkInfoService silkInfoService;

    @Inject
    private SilkResource(SilkInfoService silkInfoService) {
        this.silkInfoService = silkInfoService;
    }

    @GET
    public Collection<SilkInfo> silks() {
        return silkInfoService.list();
    }

}
