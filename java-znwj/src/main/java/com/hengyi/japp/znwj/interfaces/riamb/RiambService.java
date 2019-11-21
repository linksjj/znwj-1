package com.hengyi.japp.znwj.interfaces.riamb;

import com.google.inject.ImplementedBy;
import com.hengyi.japp.znwj.domain.SilkInfo;
import com.hengyi.japp.znwj.interfaces.riamb.internal.RiambServiceImpl;
import reactor.core.publisher.Mono;

/**
 * @author jzb 2019-11-21
 */
@ImplementedBy(RiambServiceImpl.class)
public interface RiambService {
    Mono<SilkInfo> fetch(int rfidNum);
}
