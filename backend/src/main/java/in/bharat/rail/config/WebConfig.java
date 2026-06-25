package in.bharat.rail.config;

import java.io.IOException;
import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${bharat-rail.public-dir:../public}")
  private String publicDir;

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry
        .addMapping("/**")
        .allowedOrigins("*")
        .allowedMethods("GET", "POST", "OPTIONS")
        .allowedHeaders("Content-Type", "Idempotency-Key");
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String location = Path.of(publicDir).toAbsolutePath().normalize().toUri().toString();
    if (!location.endsWith("/")) {
      location += "/";
    }

    registry
        .addResourceHandler("/**")
        .addResourceLocations(location)
        .resourceChain(true)
        .addResolver(
            new PathResourceResolver() {
              @Override
              protected Resource getResource(String resourcePath, Resource location)
                  throws IOException {
                if (resourcePath.contains("..")
                    || resourcePath.startsWith("api/")
                    || "health".equals(resourcePath)) {
                  return null;
                }

                String normalized = resourcePath.isEmpty() ? "index.html" : resourcePath;
                if (normalized.equals("/")) {
                  normalized = "index.html";
                } else if (normalized.startsWith("/")) {
                  normalized = normalized.substring(1);
                }

                Resource requested = location.createRelative(normalized);
                if (requested.exists() && requested.isReadable()) {
                  return requested;
                }

                return location.createRelative("index.html");
              }
            });
  }
}
