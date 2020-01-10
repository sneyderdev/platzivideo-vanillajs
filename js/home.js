// APIs
const MOVIES_API = 'https://yts.lt/api/v2/list_movies.json?genre=name';
const FRIENDS_API = 'https://randomuser.me/api/?results=';

// DOM Elements
const $home = document.getElementById('home');
const $form = document.getElementById('form');
const $searchInput = document.getElementById('search');
const $user = document.getElementById('user');
const $friendsContainer = document.getElementById('friends_list');
const $myPlaylistContainer = document.getElementById('playlist');
const MODAL_BUTTON_COLOR = '#95ca3e';

// Friends and movies quantity for sidebar
const NUMBER_OF_FRIENDS = '4';
const NUMBER_OF_MOVIES = 10;

const getResponse = async () => {
  // REQUESTS TO APIs - START
  const getMovies = async MOVIES_API => {
    const response = await fetch(MOVIES_API);
    const data = await response.json();
    const { movie_count: movieCount } = data.data;
    if (movieCount > 0) {
      return data;
    } else {
      throw new Error(`We couldn't find this movie. Try again.`);
    }
  }

  const getFriends = async FRIENDS_API => {
    const response = await fetch(FRIENDS_API);
    const data = await response.json();
    const { results: friendsCount } = data;
    if (friendsCount.length > 0) {
      return data;
    } else {
      throw new Error('You have no friends.');
    }
  }

  // TEMPLATES - START
  const videoItemTemplate = (movieId, movieTitle, movieCover, genre) => {
    return (
    `<div class="primaryPlaylistItem" data-id="${movieId}" data-genre="${genre}">
      <figure class="primaryPlaylistItem-image">
        <img src="${movieCover}" alt="">
      </figure>
      <h4 class="primarPlayListItem-title">
        ${movieTitle}
      </h4>
    </div>`);
  }

  const friendTemplate = (name, lastName, photo) => {
    return (
    `<a href="#" class="friend_link" data-name="${name}">
      <li class="friend">
        <figure class="user">
          <img src="${photo}" alt="Amigo" class="user-img">
        </figure>
        <span>${name} ${lastName}</span>
      </li>
    </a>`);
  }

  const playlistItemTemplate = (movieId, movieTitle) => {
    return (
    `<a href="#" class="video-link" data-id="${movieId}">
      <li class="list-video">${movieTitle}</li>
    </a>`);
  }

  const createTemplate = htmlString => {
    const HTML = document.implementation.createHTMLDocument();
    HTML.body.innerHTML = htmlString;
    return HTML.body.children[0];
  }

  // FIND MOVIE TO SHOW IN MODAL - START
  const findById = (list, id) => {
    return list.find(movie => movie.id === parseInt(id, 10));
  }

  const findMovie = (id, genre) => {
    const list = lists[genre];
    return findById(list, id);
  }

  const showMovie = movie => {
    const { id, genre } = movie.dataset;
    const data = findMovie(id, genre);
    const { title: movieTitle, description_full: movieDescription, medium_cover_image: movieImage } = data;
    Swal.fire({
      title: movieTitle,
      text: movieDescription,
      imageUrl: movieImage,
      imageWidth: '30%',
      showClass: {
        popup: 'fadeInDown'
      },
      hideClass: {
        popup: 'fadeOutUp'
      },
      confirmButtonText: 'Close',
      confirmButtonColor: MODAL_BUTTON_COLOR,
      showCloseButton: true
    });
  }

  const showMovieMyPlaylist = movie => {
    const { id: movieId } = movie.dataset;
    const data = findById(myPlaylist, movieId);
    const { title: movieTitle, description_full: movieDescription, medium_cover_image: movieImage } = data;
    Swal.fire({
      title: movieTitle,
      text: movieDescription,
      imageUrl: movieImage,
      imageWidth: '30%',
      showClass: {
        popup: 'fadeInDown'
      },
      hideClass: {
        popup: 'fadeOutUp'
      },
      confirmButtonText: 'Close',
      confirmButtonColor: MODAL_BUTTON_COLOR,
      showCloseButton: true
    });
  }

  // FIND FRIEND TO SHOW IN MODAL - START
  const findByName = (list, name) => {
    return list.find(friend => friend.name.first === name);
  }

  const showFriend = friend => {
    const { name: friendName } = friend.dataset;
    const data = findByName(friendsList, friendName);
    const { name: { first: name }, name: { last: lastName }, picture: { large: photo } } = data;
    Swal.fire({
      title: `${name} ${lastName}`,
      text: `${name} doesn't have any saved movies.`,
      imageUrl: photo,
      imageWidth: '30%',
      customClass: {
        image: 'friend_photo',
      },
      showClass: {
        popup: 'fadeInDown'
      },
      hideClass: {
        popup: 'fadeOutUp'
      },
      showConfirmButton: false,
      showCloseButton: true
    });
  }

  // EVENTS - START
  $form.addEventListener('submit', async event => {
    event.preventDefault();
    Swal.fire({
      html: '<div class="loader"></div>',
      width: 300,
      padding: '3em',
      showConfirmButton: false
    });
    const data = new FormData($form);
    movieName = data.get('movie_name');
    const URL_MOVIE = MOVIES_API.replace('genre=name', `limit=1&query_term=${movieName}`);
    try {
      const { data: { movies: [movie] } } = await getMovies(URL_MOVIE);
      const { title: movieTitle, description_full: movieDescription, medium_cover_image: movieImage } = movie;
      Swal.fire({
        title: movieTitle,
        text: movieDescription,
        imageUrl: movieImage,
        imageWidth: '30%',
        confirmButtonText: 'Close',
        confirmButtonColor: MODAL_BUTTON_COLOR,
        showCloseButton: true
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oh, no! There was a problem...',
        text: error.message,
        confirmButtonColor: MODAL_BUTTON_COLOR
      })
        .then(() => {
          $searchInput.focus();
        });
    }
  });

  $user.addEventListener('click', () => {
    Swal.fire({
      title: `Hey! I'm Sneyder Barreto`,
      text: `I hope you'd liked this little project.`,
      imageUrl: 'images/user.jpg',
      customClass: {
        image: 'user_photo',
      },
      showClass: {
        popup: 'fadeInDown'
      },
      hideClass: {
        popup: 'fadeOutUp'
      },
      showConfirmButton: false,
      showCloseButton: true,
      footer:
        `<h4 class="social_title">Follow me:</h4>
        <div class="social">
          <a href="https://twitter.com/sneyderdev" target="_blank" class="social_icon"><i class="fab fa-twitter"></i></a>
          <a href="https://github.com/sneyderdev" target="_blank" class="social_icon"><i class="fab fa-github"></i></a>
        </div>`
    });
  });

  const addEventClick = movie => {
    movie.addEventListener('click', () => {
      showMovie(movie);
    });
  }

  const addEventClickMyPlaylist = movie => {
    movie.addEventListener('click', () => {
      showMovieMyPlaylist(movie);
    });
  }

  const addEventClickFriends = friend => {
    friend.addEventListener('click', () => {
      showFriend(friend);
    });
  }

  // RENDER ELEMENTS - START
  const renderMovieList = (moviesList, $container, genre) => {
    $container.children[0].remove(); // Removing the loader
    moviesList.forEach(movie => {
      const { id: movieId, title: movieTitle, medium_cover_image: movieCover } = movie;
      const htmlTemplate = videoItemTemplate(movieId, movieTitle, movieCover, genre);
      const movieElement = createTemplate(htmlTemplate);
      $container.appendChild(movieElement);
      const movieImage = movieElement.querySelector('img');
      movieImage.addEventListener('load', image => {
        image.target.classList.add('fadeIn');
      });
      addEventClick(movieElement);
    });
  }

  const renderFriendList = (friendsList, $container) => {
    $container.children[0].remove(); // Removing the loader
    friendsList.forEach(friend => {
      const { name: { first: name }, name: { last: lastName } , picture: { medium: photo } } = friend;
      const htmlTemplate = friendTemplate(name, lastName, photo);
      const friendElement = createTemplate(htmlTemplate);
      $container.appendChild(friendElement);
      addEventClickFriends(friendElement);
    });
  }

  const renderMyPlaylist = (myList, $container) => {
    $container.children[0].remove(); // Removing the loader
    myList.forEach(movie => {
      const { id: movieId, title: movieTitle } = movie;
      const htmlTemplate = playlistItemTemplate(movieId, movieTitle);
      const movieElement = createTemplate(htmlTemplate);
      $container.appendChild(movieElement);
      addEventClickMyPlaylist(movieElement);
    });
  }

  // LOCALSTORAGE - START
  const cacheExist = async genre => {
    const listName = `${genre}List`;
    const cacheList = localStorage.getItem(listName);
    if (cacheList) {
      return JSON.parse(cacheList);
    }
    const { data: { movies: data } } = await getMovies(MOVIES_API.replace('name', genre));
    localStorage.setItem(listName, JSON.stringify(data));
    return data;
  }

  // GETTING MOVIES FOR MY PLAYLIST - START
  const myPlaylist = new Array();
  try {
    const { data: { movies: moviesList } } = await getMovies(MOVIES_API.replace('genre=name', ''));
    const MOVIES_QUANTITY = moviesList.length - 1; // The API send 20 movies
    do { // Getting random movies and not repeated
      let randomMovie = Math.round(Math.random() * MOVIES_QUANTITY);
      const compareMovies = movie => moviesList[randomMovie].id === movie.id;
      if (myPlaylist.some(compareMovies)) {
        continue;
      } else {
        myPlaylist.push(moviesList[randomMovie]);
      }
    } while (myPlaylist.length < NUMBER_OF_MOVIES);
    renderMyPlaylist(myPlaylist, $myPlaylistContainer);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oh, no! There was a problem...',
      text: error.message,
      confirmButtonColor: MODAL_BUTTON_COLOR
    });
  }

  // GETTING MOVIES FOR MAIN PAGE - START
  const genres = ['action', 'drama', 'animation', 'horror'];
  const lists = {};
  const renderGenreList = async genre => {
    const list = await cacheExist(genre);
    lists[genre] = list;
    const $container = document.getElementById(`${genre}`);
    renderMovieList(list, $container, genre);
  }
  genres.forEach(genre => renderGenreList(genre));

  // GETTING FRIENDS - START
  let friendsList = new Array();
  try {
    const { results } = await getFriends(`${FRIENDS_API}${NUMBER_OF_FRIENDS}`);
    friendsList = results;
    renderFriendList(friendsList, $friendsContainer);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oh, no! There was a problem...',
      text: error.message,
      confirmButtonColor: MODAL_BUTTON_COLOR
    });
  }
}

getResponse();