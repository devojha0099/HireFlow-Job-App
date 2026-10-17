
const parseSkills = (skills) => {
  if (!skills) return [];
  const list = Array.isArray(skills) ? skills : String(skills).split(",");
  return list.map((s) => String(s).trim()).filter(Boolean);
};

module.exports = parseSkills;
