const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// List all records
app.get('/', async (req, res) => {
  try {
    const { data: records, error } = await supabase
      .from('your_table_name')
      .select('*');

    if (error) {
      throw error;
    }

    res.render('index', { records });
  } catch (error) {
    console.error('Error fetching records:', error.message);
    res.status(500).send('Error fetching records');
  }
});

// Create a new record (GET)
app.get('/new', (req, res) => {
  res.render('new');
});

// Create a new record (POST)
app.post('/new', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('your_table_name')
      .insert([req.body]);

    if (error) {
      throw error;
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error creating record:', error.message);
    res.status(500).send('Error creating record');
  }
});

// Update a record (GET)
app.get('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { data: record, error } = await supabase
      .from('your_table_name')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    res.render('edit', { record });
  } catch (error) {
    console.error('Error fetching record:', error.message);
    res.status(500).send('Error fetching record');
  }
});

// Update a record (POST)
app.post('/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from('your_table_name')
      .update(req.body)
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error updating record:', error.message);
    res.status(500).send('Error updating record');
  }
});

// Delete a record
app.post('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from('your_table_name')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.redirect('/');
  } catch (error) {
    console.error('Error deleting record:', error.message);
    res.status(500).send('Error deleting record');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
