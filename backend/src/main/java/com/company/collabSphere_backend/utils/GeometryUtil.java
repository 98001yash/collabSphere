package com.company.collabSphere_backend.utils;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

public class GeometryUtil {

    private static final GeometryFactory geometryFactory =
            new GeometryFactory(new PrecisionModel(), 4326); // WGS84

    public static Point createPoint(Double latitude, Double longitude) {
        if (latitude == null || longitude == null) return null;
        return geometryFactory.createPoint(new Coordinate(longitude, latitude));
    }

    public static Double getLatitude(Point point) {
        return point != null ? point.getY() : null;
    }

    public static Double getLongitude(Point point) {
        return point != null ? point.getX() : null;
    }
}