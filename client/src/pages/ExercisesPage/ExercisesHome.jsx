// ExercisesHome.jsx
import React, { useEffect } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Chip, Grid, Container, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import useStudyCalls from '../../service/useStudyCalls';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ExercisesHome = () => {
  const dispatch = useDispatch();
  const { getStudies } = useStudyCalls();
  const { fastReadingExercises, fastReadingWorkouts, fastReadingTests, loading, error } = useSelector(state => state.studies);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    getStudies();
  }, [dispatch]);

  const basePath = user.isAdmin ? "/nobelhizliokuma/admin-dashboard" : user.isTeacher ? "/nobelhizliokuma/ogretmen-paneli" : "/nobelhizliokuma/ogrenci-paneli"

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                HIZLI OKUMA EGZERSİZLERİ
              </Typography>
              <Typography variant="body2">
                Göz kaslarını geliştirme, aktif görme alanını genişletme, hızlı odaklanma gibi yeteneklerin geliştirilmesine yönelik hazırlanmış egzersizlere göz atın.
              </Typography>
              <List>
                {fastReadingExercises.map((exercise, index) => (
                  <ListItem button component={Link} to={`${basePath}/egzersizler/${exercise.urlName}`} key={index}>
                    <ListItemText primary={exercise.title} />
                    {exercise.new && (
                      <ListItemSecondaryAction>
                        <Chip label="YENİ" color="secondary" />
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                HIZLI OKUMA ÇALIŞMALARI
              </Typography>
              <Typography variant="body2">
                Okuma metinleri üzerinde ritmik göz hareketleri ile okuma yeteneğini kazanabilmek için oluşturulmuş çalışmalara göz atın.
              </Typography>
              <List>
                {fastReadingWorkouts.map((workout, index) => (
                  <ListItem button component={Link} to={`${basePath}/workouts/${test.urlName}`} key={index}>
                    <ListItemText primary={workout.title} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                HIZLI OKUMA TESTİ
              </Typography>
              <Typography variant="body2">
                2 farklı kütüphane üzerinde bulunan 93 metin içerisinden dilediğiniz metin ile okuma hızınızı ölçebilmenizi sağlayan hızlı okuma testi sayfasına göz atın.
              </Typography>
              <List>
                {fastReadingTests.map((test, index) => (
                  <ListItem button component={Link} to={`${basePath}/egzersizler/${test.urlName}`} key={index}>
                    <ListItemText primary={test.title} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExercisesHome;
