package in.bharat.rail.model;

public record Train(
    String number,
    String name,
    String type,
    String fromCode,
    String fromName,
    String toCode,
    String toName,
    String depart,
    String arrive,
    String duration,
    String availability,
    String culture,
    int fare,
    int seats,
    double rating) {}
