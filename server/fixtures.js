// Dummy locations
if (Locations.find().count() == 0) {
  Locations.insert({
    hashtag: 'ConnaughtPlace',
    name: 'Connaught Place'
  });

  Locations.insert({
    hashtag: 'GreaterKailash2',
    name: 'Greater Kailash 2'
  });

  Locations.insert({
    hashtag: 'VasantVihar',
    name: 'Vasant Vihar'
  });

  Locations.insert({
    hashtag: 'VasantKunj',
    name: 'Vasant Kunj'
  });

  Locations.insert({
    hashtag: 'Rohini',
    name: 'Rohini'
  });
}
