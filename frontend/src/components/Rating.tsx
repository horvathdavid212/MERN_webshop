import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { Typography, Box } from "@mui/material";

interface RatingProps {
  rating: number;
  numReviews?: number;
  caption?: string;
  username?: string;
}

const Rating = ({ rating, numReviews, caption, username }: RatingProps) => {
  function getStarIcons() {
    const starIcons = [];
    const maxStars = 5;
    const starColor = "rgb(255, 200, 70)";

    for (let i = 0; i < maxStars; i++) {
      if (rating >= i + 1) {
        starIcons.push(<BsStarFill key={i} style={{ color: starColor }} />);
      } else if (rating >= i + 0.5) {
        starIcons.push(<BsStarHalf key={i} style={{ color: starColor }} />);
      } else {
        starIcons.push(<BsStar key={i} style={{ color: starColor }} />);
      }
    }

    return starIcons;
  }

  const starIcons = getStarIcons();

  return (
    <Box display="flex" justifyContent="left" alignItems="center">
      <Box display="flex" alignItems="center">
        {starIcons.map((icon, index) => (
          <span key={index}>{icon}</span>
        ))}
      </Box>
      {username ? (
        <Typography variant="body1" marginLeft={3}>
          {username}
        </Typography>
      ) : null}

      {numReviews ? (
        <Typography
          variant="body1"
          marginLeft={1}
          sx={{
            verticalAlign: "bottom",
            display: "inline-flex",
            alignItems: "flex-end",
          }}
        >
          {caption ? caption : `${numReviews} értékelés`}
        </Typography>
      ) : null}
    </Box>
  );
};

export default Rating;
