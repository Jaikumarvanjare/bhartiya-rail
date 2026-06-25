package in.bharat.rail.service;

import in.bharat.rail.model.Station;
import in.bharat.rail.model.Train;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class RailDataService {

  private static final List<Station> STATIONS =
      List.of(
          new Station(
              "NDLS",
              "New Delhi",
              "Delhi",
              "Northern India",
              "Mughal avenues, capital routes, and national connections"),
          new Station(
              "BSB",
              "Varanasi Junction",
              "Varanasi",
              "Gangetic Plains",
              "Temple bells, ghats, silk, and sacred river journeys"),
          new Station(
              "CSMT",
              "Chhatrapati Shivaji Maharaj Terminus",
              "Mumbai",
              "Western Coast",
              "Gothic heritage station and Maratha-era city memory"),
          new Station(
              "MMCT",
              "Mumbai Central",
              "Mumbai",
              "Western Coast",
              "Gateway routes toward Gujarat, Rajasthan, and Delhi"),
          new Station(
              "HWH",
              "Howrah Junction",
              "Kolkata",
              "Eastern India",
              "Hooghly river crossings, literature, food, and old port routes"),
          new Station(
              "MAS",
              "MGR Chennai Central",
              "Chennai",
              "Coromandel Coast",
              "Dravidian temple corridors and southern coastal rail"),
          new Station(
              "SBC",
              "KSR Bengaluru",
              "Bengaluru",
              "Deccan Plateau",
              "Garden city, tech corridors, and old Mysore links"),
          new Station(
              "JP",
              "Jaipur Junction",
              "Jaipur",
              "Rajasthan",
              "Pink city arches, forts, crafts, and desert gateways"),
          new Station(
              "AII",
              "Ajmer Junction",
              "Ajmer",
              "Rajasthan",
              "Sufi heritage, Aravalli hills, and pilgrimage routes"),
          new Station(
              "ASR",
              "Amritsar Junction",
              "Amritsar",
              "Punjab",
              "Golden Temple, frontier stories, and Punjabi food culture"),
          new Station(
              "BPL",
              "Bhopal Junction",
              "Bhopal",
              "Central India",
              "Lakes, Buddhist routes, and central India junctions"),
          new Station(
              "SVDK",
              "Shri Mata Vaishno Devi Katra",
              "Katra",
              "Jammu",
              "Himalayan foothills and pilgrimage travel"));

  private static final List<Train> TRAINS =
      List.of(
          new Train(
              "22436",
              "Vande Bharat Kashi",
              "Vande Bharat",
              "NDLS",
              "New Delhi",
              "BSB",
              "Varanasi Junction",
              "06:00",
              "14:05",
              "8h 05m",
              "Available",
              "Capital to Kashi route with ghats, temple craft, and silk markets",
              1840,
              62,
              4.8),
          new Train(
              "12951",
              "Mumbai Rajdhani",
              "Rajdhani",
              "MMCT",
              "Mumbai Central",
              "NDLS",
              "New Delhi",
              "17:00",
              "08:35",
              "15h 35m",
              "RAC",
              "Western coast to capital corridor through Gujarat and Rajasthan",
              3920,
              18,
              4.7),
          new Train(
              "12301",
              "Howrah Rajdhani",
              "Rajdhani",
              "HWH",
              "Howrah Junction",
              "NDLS",
              "New Delhi",
              "16:50",
              "10:05",
              "17h 15m",
              "Available",
              "Hooghly river heritage, Bengal food, and the grand trunk corridor",
              4210,
              35,
              4.6),
          new Train(
              "12002",
              "Shatabdi Bhopal",
              "Shatabdi",
              "NDLS",
              "New Delhi",
              "BPL",
              "Bhopal Junction",
              "06:00",
              "14:25",
              "8h 25m",
              "Available",
              "Fast day route linking capital avenues with the lake city",
              1650,
              71,
              4.5),
          new Train(
              "20977",
              "Ajmer Vande Bharat",
              "Vande Bharat",
              "AII",
              "Ajmer Junction",
              "NDLS",
              "New Delhi",
              "06:20",
              "11:35",
              "5h 15m",
              "Available",
              "Aravalli views, Sufi heritage, and north Indian palace towns",
              1495,
              44,
              4.6),
          new Train(
              "12903",
              "Golden Temple Mail",
              "Mail Express",
              "MMCT",
              "Mumbai Central",
              "ASR",
              "Amritsar Junction",
              "18:45",
              "23:35",
              "28h 50m",
              "Waitlist",
              "From Arabian Sea business streets to Punjab's sacred city",
              2860,
              0,
              4.1),
          new Train(
              "12627",
              "Karnataka Express",
              "Superfast",
              "SBC",
              "KSR Bengaluru",
              "NDLS",
              "New Delhi",
              "19:20",
              "10:30",
              "39h 10m",
              "Available",
              "Deccan plateau journey across languages, crops, and cuisines",
              3380,
              54,
              4.3),
          new Train(
              "12841",
              "Coromandel Express",
              "Superfast",
              "HWH",
              "Howrah Junction",
              "MAS",
              "MGR Chennai Central",
              "14:50",
              "17:00",
              "26h 10m",
              "Available",
              "Bay of Bengal rail story through Odisha and the Coromandel coast",
              2745,
              29,
              4.2),
          new Train(
              "12957",
              "Swarna Jayanti Rajdhani",
              "Rajdhani",
              "NDLS",
              "New Delhi",
              "JP",
              "Jaipur Junction",
              "19:55",
              "00:10",
              "4h 15m",
              "Available",
              "Short heritage hop to pink sandstone, forts, and block prints",
              1190,
              83,
              4.4),
          new Train(
              "22439",
              "Vande Bharat Katra",
              "Vande Bharat",
              "NDLS",
              "New Delhi",
              "SVDK",
              "Shri Mata Vaishno Devi Katra",
              "06:00",
              "14:00",
              "8h 00m",
              "Available",
              "Capital to Himalayan foothills pilgrimage corridor",
              1720,
              37,
              4.7));

  public Map<String, Object> stationsPayload() {
    return Map.of("stations", STATIONS);
  }

  public Map<String, Object> trainsPayload(Map<String, String> query) {
    List<Train> filtered = TRAINS.stream().filter(train -> trainMatches(train, query)).toList();
    return Map.of("count", filtered.size(), "trains", filtered);
  }

  public Map<String, Object> historyPayload() {
    List<Map<String, String>> timeline =
        List.of(
            timelineEntry(
                "1853",
                "First passenger train",
                "On 16 April 1853, India's first passenger train ran from Bombay to Thane, covering about 34 km with 14 carriages and around 400 passengers.",
                "Bombay Presidency"),
            timelineEntry(
                "1854",
                "The line reaches Kalyan",
                "The early western railway expanded beyond Thane toward Kalyan, including difficult bridge work around Thane Creek.",
                "Western India"),
            timelineEntry(
                "1854",
                "Eastern India service",
                "Passenger railway service began from the Howrah side toward Hooghly, linking the Bengal river corridor to rail travel.",
                "Bengal"),
            timelineEntry(
                "1856",
                "South India rail growth",
                "Railway activity expanded in the Madras region, helping connect coastal trading cities and inland towns.",
                "Southern India"),
            timelineEntry(
                "1925",
                "Electric traction begins",
                "Electric train operation began in the Bombay region, starting a long modernization path for suburban and mainline rail.",
                "Bombay"),
            timelineEntry(
                "1951",
                "Indian Railways consolidation",
                "After independence, many railway systems were consolidated into Indian Railways, creating a unified national network.",
                "India"),
            timelineEntry(
                "1977",
                "National Rail Museum",
                "The Rail Transport Museum opened in New Delhi, later becoming the National Rail Museum and preserving locomotives, coaches, and archives.",
                "New Delhi"),
            timelineEntry(
                "2019",
                "Vande Bharat era",
                "Vande Bharat introduced a modern Indian semi-high-speed train identity with faster acceleration, better passenger comfort, and indigenous manufacturing focus.",
                "Modern India"));

    return Map.of(
        "timeline",
        timeline,
        "summary",
        "Indian railways grew from a short steam-hauled passenger service into one of the world's most important public transport systems, carrying people, goods, stories, food, festivals, and languages across the country.");
  }

  public Map<String, Object> dashboardPayload() {
    Map<String, Object> profile =
        Map.of(
            "name", "Vikram Rao",
            "tier", "Platinum Yatri",
            "points", 42880,
            "journeys", 126,
            "savedPassengers", 4);

    Map<String, Object> upcoming =
        Map.of(
            "pnr", "BR48291372",
            "train", "22436 Vande Bharat Kashi",
            "from", "New Delhi",
            "to", "Varanasi Junction",
            "coach", "C3",
            "seat", "42",
            "date", "2026-07-12",
            "status", "Confirmed");

    return Map.of(
        "profile",
        profile,
        "upcoming",
        upcoming,
        "insights",
        List.of(
            "Most travelled corridor: Delhi to Varanasi",
            "Favourite meal: Banarasi thali",
            "Carbon saver badge unlocked for electric corridors"));
  }

  public Map<String, Object> diningPayload() {
    List<Map<String, Object>> meals =
        List.of(
            meal("Banarasi Thali", "Uttar Pradesh", "Vegetarian", 260, "Kachori, seasonal sabzi, dal, rice, curd, and a small sweet."),
            meal("Rajasthani Heritage Box", "Rajasthan", "Vegetarian", 310, "Dal baati churma inspired platter with pickles and millet roti."),
            meal("Bengal Comfort Meal", "Bengal", "Vegetarian", 285, "Rice, dal, aloo posto style vegetables, chutney, and sandesh."),
            meal("Deccan Breakfast", "Karnataka", "Vegetarian", 180, "Idli, vada, upma, coconut chutney, and filter coffee."),
            meal("Punjab Rail Dhaba", "Punjab", "Vegetarian", 295, "Paratha, chole, lassi, salad, and jaggery."),
            meal("Coastal Coromandel Tray", "Tamil Nadu", "Vegetarian", 250, "Lemon rice, curd rice, poriyal, sambar, and banana chips."));

    return Map.of("meals", meals);
  }

  public Map<String, Object> livePayload(String trainNumber) {
    String train = trainNumber == null || trainNumber.isBlank() ? "22436" : trainNumber;

    List<Map<String, String>> stops =
        List.of(
            stop("New Delhi", "06:00", "done"),
            stop("Kanpur Central", "10:42", "done"),
            stop("Prayagraj Junction", "12:36", "active"),
            stop("Varanasi Junction", "14:05", "next"));

    Map<String, Object> payload = new LinkedHashMap<>();
    payload.put("train", train);
    payload.put("status", "On time");
    payload.put("lastStation", "Kanpur Central");
    payload.put("nextStation", "Prayagraj Junction");
    payload.put("speedKmph", 122);
    payload.put("platform", "4");
    payload.put("progress", 64);
    payload.put("stops", stops);
    return payload;
  }

  public Map<String, Object> bookingPayload(String body) {
    long hash = Integer.toUnsignedLong((body + System.nanoTime()).hashCode());
    int passengerCount = countOccurrences(body, "\"gender\"");
    if (passengerCount == 0) {
      passengerCount = Math.max(1, countOccurrences(body, "\"name\""));
    }

    String pnr = String.format("BR%08d", hash % 100_000_000L);
    String bookingId = "BK" + (hash % 1_000_000L);

    List<String> berths = new ArrayList<>();
    for (int i = 0; i < passengerCount; i++) {
      berths.add("C" + (3 + (i / 72)) + "-" + (41 + i));
    }

    return Map.of(
        "status", "confirmed",
        "pnr", pnr,
        "bookingId", bookingId,
        "message", "Booking confirmed in the Bharat Rail prototype.",
        "coach", "C3",
        "berths", berths,
        "heritageHint",
            "Reach the station early and look for the architecture story panel near the concourse.");
  }

  private static boolean trainMatches(Train train, Map<String, String> query) {
    String from = query.getOrDefault("from", "");
    String to = query.getOrDefault("to", "");
    String travelClass = query.getOrDefault("class", "");
    String q = query.getOrDefault("q", "");

    if (!from.isEmpty()
        && !train.fromCode().equals(from)
        && !containsIgnoreCase(train.fromName(), from)) {
      return false;
    }
    if (!to.isEmpty() && !train.toCode().equals(to) && !containsIgnoreCase(train.toName(), to)) {
      return false;
    }
    if (!q.isEmpty()
        && !containsIgnoreCase(train.name(), q)
        && !containsIgnoreCase(train.type(), q)
        && !containsIgnoreCase(train.culture(), q)) {
      return false;
    }
    return !"SL".equals(travelClass) || !"Vande Bharat".equals(train.type());
  }

  private static boolean containsIgnoreCase(String value, String needle) {
    return value.toLowerCase(Locale.ROOT).contains(needle.toLowerCase(Locale.ROOT));
  }

  private static int countOccurrences(String haystack, String needle) {
    if (needle.isEmpty()) {
      return 0;
    }
    int count = 0;
    int index = 0;
    while ((index = haystack.indexOf(needle, index)) != -1) {
      count++;
      index += needle.length();
    }
    return count;
  }

  private static Map<String, String> timelineEntry(
      String year, String title, String detail, String region) {
    return Map.of("year", year, "title", title, "detail", detail, "region", region);
  }

  private static Map<String, Object> meal(
      String name, String region, String type, int price, String note) {
    return Map.of("name", name, "region", region, "type", type, "price", price, "note", note);
  }

  private static Map<String, String> stop(String name, String time, String state) {
    return Map.of("name", name, "time", time, "state", state);
  }
}
