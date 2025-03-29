SELECT p.id
FROM profiles p
JOIN locations l ON p.id = l.profile_id
WHERE (
    6371 * acos(
        cos(radians($1)) * cos(radians(l.latitude::double precision)) *
        cos(radians(l.longitude::double precision) - radians($2)) +
        sin(radians($1)) * sin(radians(l.latitude::double precision))
    )
) <= $3

