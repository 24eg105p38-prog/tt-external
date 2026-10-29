package com.college.events.repository;

import com.college.events.model.Participant;
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
public class ParticipantRepository {

    private final JdbcTemplate jdbcTemplate;

    public ParticipantRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Participant> participantRowMapper = (rs, rowNum) -> {
        Timestamp ts = rs.getTimestamp("registered_at");
        return new Participant(
                rs.getLong("id"),
                rs.getLong("event_id"),
                rs.getString("event_name"),
                rs.getString("event_date"),
                rs.getString("event_venue"),
                rs.getString("name"),
                rs.getString("email"),
                ts != null ? ts.toLocalDateTime() : null
        );
    };

    public List<Participant> findByEventId(Long eventId) {
        String sql = """
            SELECT p.id, p.event_id, e.name AS event_name, e.event_date AS event_date, e.venue AS event_venue,
                   p.name, p.email, p.registered_at
            FROM participants p
            JOIN events e ON p.event_id = e.id
            WHERE p.event_id = ?
            ORDER BY p.registered_at DESC
        """;
        return jdbcTemplate.query(sql, participantRowMapper, eventId);
    }

    public List<Participant> findByEmail(String email) {
        String sql = """
            SELECT p.id, p.event_id, e.name AS event_name, e.event_date AS event_date, e.venue AS event_venue,
                   p.name, p.email, p.registered_at
            FROM participants p
            JOIN events e ON p.event_id = e.id
            WHERE LOWER(p.email) = LOWER(?)
            ORDER BY e.event_date ASC
        """;
        return jdbcTemplate.query(sql, participantRowMapper, email.trim());
    }

    public Optional<Participant> findById(Long id) {
        String sql = """
            SELECT p.id, p.event_id, e.name AS event_name, e.event_date AS event_date, e.venue AS event_venue,
                   p.name, p.email, p.registered_at
            FROM participants p
            JOIN events e ON p.event_id = e.id
            WHERE p.id = ?
        """;
        List<Participant> results = jdbcTemplate.query(sql, participantRowMapper, id);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public boolean existsByEventIdAndEmail(Long eventId, String email) {
        String sql = "SELECT COUNT(*) FROM participants WHERE event_id = ? AND LOWER(email) = LOWER(?)";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, eventId, email.trim());
        return count != null && count > 0;
    }

    public Participant register(Long eventId, String name, String email) {
        String sql = "INSERT INTO participants (event_id, name, email) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, eventId);
            ps.setString(2, name.trim());
            ps.setString(3, email.trim().toLowerCase());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        Long newId = (key != null) ? key.longValue() : null;

        return findById(newId).orElseThrow(() -> new IllegalStateException("Failed to retrieve created participant registration"));
    }

    public boolean deleteById(Long id) {
        String sql = "DELETE FROM participants WHERE id = ?";
        int rows = jdbcTemplate.update(sql, id);
        return rows > 0;
    }

    public int countAll() {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM participants", Integer.class);
        return count != null ? count : 0;
    }

    public int countByEventId(Long eventId) {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM participants WHERE event_id = ?", Integer.class, eventId);
        return count != null ? count : 0;
    }
}
