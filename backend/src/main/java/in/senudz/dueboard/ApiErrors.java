package in.senudz.dueboard;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;
@RestControllerAdvice
public class ApiErrors {
    private static final Logger log = LoggerFactory.getLogger(ApiErrors.class);
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,String>> handle(RuntimeException e) {
        String msg = e.getMessage() == null ? "Request failed" : e.getMessage();
        int code = msg.toLowerCase().contains("invalid") ? 401 : 400;
        if (code == 401) log.warn("auth {}", msg); else log.warn("bad request {}", msg);
        return ResponseEntity.status(code).body(Map.of("error", msg));
    }
}
