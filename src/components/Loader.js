import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
  },
  loader: {
    fontSize: 80,
  },
}));

const Loader = () => {
  const classes = useStyles();
  const gradientColors = "linear-gradient(to right, #a200d6, #ff6fdf)";
  return (
    <div className={classes.root}>
      <CircularProgress
        style={{ color: gradientColors }}
        size={80}
        thickness={5.5}
      />
    </div>
  );
};

export default Loader;
