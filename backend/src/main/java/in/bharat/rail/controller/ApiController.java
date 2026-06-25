package in.bharat.rail.controller;

import in.bharat.rail.service.RailDataService;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

  private final RailDataService railDataService;

  public ApiController(RailDataService railDataService) {
    this.railDataService = railDataService;
  }

  @GetMapping("/stations")
  public Map<String, Object> stations() {
    return railDataService.stationsPayload();
  }

  @GetMapping("/trains")
  public Map<String, Object> trains(@RequestParam Map<String, String> query) {
    return railDataService.trainsPayload(query);
  }

  @GetMapping("/history")
  public Map<String, Object> history() {
    return railDataService.historyPayload();
  }

  @GetMapping("/dashboard")
  public Map<String, Object> dashboard() {
    return railDataService.dashboardPayload();
  }

  @GetMapping("/dining")
  public Map<String, Object> dining() {
    return railDataService.diningPayload();
  }

  @GetMapping("/live")
  public Map<String, Object> live(@RequestParam(value = "train", required = false) String train) {
    return railDataService.livePayload(train);
  }

  @PostMapping("/bookings")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> bookings(@RequestBody(required = false) String body) {
    return railDataService.bookingPayload(body == null ? "" : body);
  }
}
