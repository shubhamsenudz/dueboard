package in.senudz.dueboard;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.util.UUID;
@Component
public class RequestLogFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(RequestLogFilter.class);
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws java.io.IOException, ServletException {
        String rid = req.getHeader("X-Request-Id");
        if (rid == null || rid.isBlank()) rid = UUID.randomUUID().toString().substring(0, 8);
        long t0 = System.currentTimeMillis();
        MDC.put("rid", rid);
        MDC.put("method", req.getMethod());
        MDC.put("path", req.getRequestURI());
        res.setHeader("X-Request-Id", rid);
        try {
            chain.doFilter(req, res);
        } finally {
            long ms = System.currentTimeMillis() - t0;
            MDC.put("status", String.valueOf(res.getStatus()));
            MDC.put("ms", String.valueOf(ms));
            if (!req.getRequestURI().startsWith("/api/health")) {
                log.info("http");
            }
            MDC.clear();
        }
    }
}
