export const truncateDescription = (description: string) => {
  const words = description.split(" ");
  if (words.length > 10) {
    return `${words.slice(0, 10).join(" ")} ...`;
  }
  return description;
};
