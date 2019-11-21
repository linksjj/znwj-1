package com.hengyi.japp.znwj.interfaces.riamb.internal;

import com.github.ixtf.japp.codec.Jcodec;
import com.google.inject.Singleton;
import com.hengyi.japp.znwj.domain.SilkInfo;
import com.hengyi.japp.znwj.interfaces.riamb.RiambService;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.util.Date;

/**
 * @author jzb 2019-11-21
 */
@Slf4j
@Singleton
public class RiambServiceImpl implements RiambService {
    @Override
    public Mono<SilkInfo> fetch(int rfidNum) {
        return Mono.fromCallable(() -> {
            // fixme 获取丝锭信息
            final String code = Jcodec.uuid58();
            final SilkInfo silkInfo = new SilkInfo();
            silkInfo.setRfidNum(rfidNum);
            silkInfo.setId(code);
            silkInfo.setCode(code);
            silkInfo.setBuildDateTime(new Date());
            return silkInfo;
        });
    }
}
