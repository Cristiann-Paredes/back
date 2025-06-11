import app from './server.js'
import connection from './database.js'

connection()

app.listen(app.get('port'), () => {
  console.log(`✅ Server running on port ${app.get('port')}`);
});

