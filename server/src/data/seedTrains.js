const ROWS = [
  ["22436", "Vande Bharat Kashi", "Vande Bharat", "NDLS", "New Delhi", "BSB", "Varanasi Junction", "06:00", "14:05", "8h 05m", "Available", "Capital to Kashi route with ghats, temple craft, and silk markets", 1840, 62, 4.8],
  ["12951", "Mumbai Rajdhani", "Rajdhani", "MMCT", "Mumbai Central", "NDLS", "New Delhi", "17:00", "08:35", "15h 35m", "RAC", "Western coast to capital corridor through Gujarat and Rajasthan", 3920, 18, 4.7],
  ["12301", "Howrah Rajdhani", "Rajdhani", "HWH", "Howrah Junction", "NDLS", "New Delhi", "16:50", "10:05", "17h 15m", "Available", "Hooghly river heritage, Bengal food, and the grand trunk corridor", 4210, 35, 4.6],
  ["12002", "Shatabdi Bhopal", "Shatabdi", "NDLS", "New Delhi", "BPL", "Bhopal Junction", "06:00", "14:25", "8h 25m", "Available", "Fast day route linking capital avenues with the lake city", 1650, 71, 4.5],
  ["20977", "Ajmer Vande Bharat", "Vande Bharat", "AII", "Ajmer Junction", "NDLS", "New Delhi", "06:20", "11:35", "5h 15m", "Available", "Aravalli views, Sufi heritage, and north Indian palace towns", 1495, 44, 4.6],
  ["12903", "Golden Temple Mail", "Mail Express", "MMCT", "Mumbai Central", "ASR", "Amritsar Junction", "18:45", "23:35", "28h 50m", "Waitlist", "From Arabian Sea business streets to Punjab's sacred city", 2860, 0, 4.1],
  ["12627", "Karnataka Express", "Superfast", "SBC", "KSR Bengaluru", "NDLS", "New Delhi", "19:20", "10:30", "39h 10m", "Available", "Deccan plateau journey across languages, crops, and cuisines", 3380, 54, 4.3],
  ["12841", "Coromandel Express", "Superfast", "HWH", "Howrah Junction", "MAS", "MGR Chennai Central", "14:50", "17:00", "26h 10m", "Available", "Bay of Bengal rail story through Odisha and the Coromandel coast", 2745, 29, 4.2],
  ["12957", "Swarna Jayanti Rajdhani", "Rajdhani", "NDLS", "New Delhi", "JP", "Jaipur Junction", "19:55", "00:10", "4h 15m", "Available", "Short heritage hop to pink sandstone, forts, and block prints", 1190, 83, 4.4],
  ["22439", "Vande Bharat Katra", "Vande Bharat", "NDLS", "New Delhi", "SVDK", "Shri Mata Vaishno Devi Katra", "06:00", "14:00", "8h 00m", "Available", "Capital to Himalayan foothills pilgrimage corridor", 1720, 37, 4.7]
];

function rowToTrain(row) {
  const [number, name, type, fromCode, fromName, toCode, toName, depart, arrive, duration, availability, culture, fare, seats, rating] = row;
  return { number, name, type, fromCode, fromName, toCode, toName, depart, arrive, duration, availability, culture, fare, seats, rating };
}

export const SEED_TRAINS = ROWS.map(rowToTrain);
