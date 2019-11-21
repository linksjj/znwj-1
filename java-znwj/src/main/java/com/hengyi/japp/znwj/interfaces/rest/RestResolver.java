package com.hengyi.japp.znwj.interfaces.rest;

import com.github.ixtf.vertx.ws.rs.JaxRsRouteResolver;

/**
 * @author jzb 2019-11-19
 */
public class RestResolver extends JaxRsRouteResolver {

    @Override
    protected String[] getPackages() {
        return new String[]{this.getClass().getPackageName()};
    }

}
