package com.hengyi.japp.znwj.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.ixtf.japp.core.J;
import lombok.Data;

import java.io.Serializable;

/**
 * @author jzb 2019-11-20
 */
@Data
public class MesAutoExceptionInfo implements Serializable {
    private String exception;

    @JsonIgnore
    public boolean hasException() {
        return J.nonBlank(exception);
    }
}
