package com.college.events.repository;

import com.college.events.dto.CreateEventRequest;
import com.college.events.model.Event;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class EventRepository {

    private final JdbcTemplate jdbcTemplate;

    public EventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Event> eventRowMapper = (rs, rowNum) -> {
        Timestamp ts = rs.getTimestamp("created_at");
        return new Event(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("event_date"),
                rs.getString("venue"),
                rs.getString("description"),
                ts != null ? ts.toLocalDateTime() : null,
                rs.getInt("total_registrations")
        );
    };

    public List<Event> findAllWithRegistrationCounts() {
        String sql = """
            SELECT e.id, e.name, e.event_date, e.venue, e.description, e.created_at,
                   COUNT(p.id) AS total_registrations
            FROM events e
            LEFT JOIN participants p ON e.id = p.event_id
            GROUP BY e.id, e.name, e.event_date, e.venue, e.description, e.created_at
            ORDER BY e.event_date ASC
        """;
        return jdbcTemplate.query(sql, eventRowMapper);
    }

    public Optional<Event> findById(Long id) {
        String sql = """
            SELECT e.id, e.name, e.event_date, e.venue, e.description, e.created_at,
                   COUNT(p.id) AS total_registrations
            FROM events e
            LEFT JOIN participants p ON e.id = p.event_id
            WHERE e.id = ?
            GROUP BY e.id, e.name, e.event_date, e.venue, e.description, e.created_at
        """;
        List<Event> results = jdbcTemplate.query(sql, eventRowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public Event save(CreateEventRequest req) {
        String sql = "INSERT INTO events (name, event_date, venue, description) VALUES (?, ?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, req.getName().trim());
            ps.setString(2, req.getDate().trim());
            ps.setString(3, req.getVenue().trim());
            ps.setString(4, req.getDescription().trim());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        Long newId = (key != null) ? key.longValue() : null;

        return findById(newId).orElseThrow(() -> new IllegalStateException("Failed to retrieve created event"));
    }

    public boolean deleteById(Long id) {
        String sql = "DELETE FROM events WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }

    public int countAll() {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM events", Integer.class);
        return count != null ? count : 0;
    }
}
