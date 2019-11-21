package com.hengyi.japp.znwj.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.github.ixtf.japp.core.J;
import lombok.Data;

import java.io.Serializable;
import java.util.Set;

/**
 * @author jzb 2019-11-20
 */
@Data
public class DetectExceptionInfo implements Serializable {
    private String exception;
    private Set<String> exceptionImageFileNames;

    @JsonIgnore
    public boolean hasException() {
        return J.nonBlank(exception);
    }
}
