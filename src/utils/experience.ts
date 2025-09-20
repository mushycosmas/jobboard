export const calculateTotalExperience = (experiences?: { from_date?: string; to_date?: string }[]) => {
  if (!experiences || experiences.length === 0) return "0 yr";

  let totalMonths = 0;

  experiences.forEach((exp) => {
    const from = exp.from_date ? new Date(exp.from_date) : null;
    const to = exp.to_date ? new Date(exp.to_date) : new Date(); // Present if null

    if (from) {
      let months = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
      if (months > 0) totalMonths += months;
    }
  });

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (years > 0 && months > 0) return `${years} yr${years > 1 ? "s" : ""} ${months} mo`;
  if (years > 0) return `${years} yr${years > 1 ? "s" : ""}`;
  if (months > 0) return `${months} mo`;

  return "0 yr";
};
