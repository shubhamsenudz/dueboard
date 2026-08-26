package in.senudz.dueboard;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override public void addCorsMappings(CorsRegistry r){
        r.addMapping("/api/**")
         .allowedOriginPatterns("*")
         .allowedMethods("GET","POST","PUT","PATCH","DELETE","OPTIONS")
         .allowedHeaders("*")
         .exposedHeaders("Authorization")
         .maxAge(3600);
    }
}
