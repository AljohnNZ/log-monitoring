import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    debug: process.env.DEBUG || false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '-05:00',
  });

export async function getClusters() {
    const [rows] = await pool.query('SELECT DISTINCT cluster FROM logs');
    return rows.map((row) => row.cluster);
}

export async function getTypes(cluster) {
    const [rows] = await pool.query('SELECT DISTINCT type FROM logs WHERE cluster = ?', [cluster]);
    return rows.map((row) => row.type);
}

export async function getLogs(cluster, type, minDuration, limit = 100, offset = 0) {
    const [rows] = await pool.query(
        "SELECT * FROM logs WHERE cluster = ? AND type = ? AND duration > ? AND (lower(message) like 'set%select' or lower(message) like 'select%') ORDER by timestamp desc LIMIT ? OFFSET ?",
        [cluster, type, minDuration, limit, offset]);
    return rows;
}

export async function getLogsCount(cluster, type, minDuration){
    const [rows] = await pool.query(
        'SELECT COUNT(*) as count from logs WHERE cluster = ? AND type = ? AND duration > ?',
        [cluster, type, minDuration]
    )
    return rows[0].count;
}

export async function getLogsCountPerDay(cluster, type) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) as count, DATE(timestamp) as d 
        FROM logs
        WHERE timestamp > DATE_SUB(NOW(), INTERVAL 28 DAY) 
        AND type = ? 
        AND cluster = ? 
        GROUP BY d`,
        [type, cluster]
    );
    return rows;
}


export async function getLogsCountPerHour(cluster, type) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) as count, DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') as d 
        FROM logs 
        WHERE timestamp > DATE_SUB(NOW(), INTERVAL 28 DAY) 
        AND type = ? 
        AND cluster = ? 
        GROUP BY d`,
        [type, cluster]
    );
    return rows;
}

export async function getLogsCountPerQuery(cluster, type) {
    const [rows] = await pool.query(
        "SELECT LEFT(message, 30) AS query, COUNT(*) AS count from logs WHERE cluster = ? AND type = ? AND timestamp > DATE_SUB(NOW(), INTERVAL 28 DAY)  GROUP BY query having count > 50 order by count desc",
        [cluster, type]
    );
    return rows;
}
