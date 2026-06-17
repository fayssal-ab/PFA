package com.emsi.pfa.Security;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class RateLimitFilter implements Filter {

    private final Map<String, List<Long>> requestLog = new ConcurrentHashMap<>();

    private static final Map<String, long[]> LIMITS = Map.of(
        "/auth/login",           new long[]{5,  60_000L},
        "/auth/forgot-password", new long[]{3, 3_600_000L}
    );

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        String path = request.getRequestURI();
        long[] limit = LIMITS.get(path);

        if (limit != null) {
            String key = path + ":" + request.getRemoteAddr();
            long now = System.currentTimeMillis();
            long maxRequests = limit[0];
            long window = limit[1];

            List<Long> timestamps = requestLog.computeIfAbsent(
                key, k -> Collections.synchronizedList(new ArrayList<>())
            );

            synchronized (timestamps) {
                timestamps.removeIf(t -> now - t > window);
                if (timestamps.size() >= maxRequests) {
                    HttpServletResponse response = (HttpServletResponse) res;
                    response.setStatus(429);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"Trop de requêtes. Veuillez réessayer plus tard.\"}");
                    return;
                }
                timestamps.add(now);
            }
        }

        chain.doFilter(req, res);
    }
}
