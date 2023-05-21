import React, { ChangeEvent, useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const FullPhotos = photosFromServer.map(photo => {
  const album = albumsFromServer.find(currentAlbum => (
    currentAlbum.id === photo.albumId
  ));

  const user = usersFromServer.find(currentUser => (
    currentUser.id === album?.userId
  ));

  return (
    {
      ...photo,
      album,
      user,
    }
  );
});

export const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<number[]>([]);

  const handelInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSelectedAlbum = (albumId: number) => {
    setSelectedAlbum(currAlbum => {
      if (selectedAlbum.includes(albumId)) {
        return currAlbum.filter(album => album !== albumId);
      }

      return [...currAlbum, albumId];
    });
  };

  const handleReset = () => {
    setSelectedUser(0);
    setQuery('');
    setSelectedAlbum([]);
  };

  let visiblePhotos = [...FullPhotos];

  if (selectedUser) {
    visiblePhotos = visiblePhotos.filter(photo => (
      photo.user?.id === selectedUser
    ));
  }

  if (query) {
    const updatedQuery = query.toLowerCase();

    visiblePhotos = visiblePhotos.filter(photo => {
      return photo.title.toLowerCase().includes(updatedQuery);
    });
  }

  if (selectedAlbum.length > 0) {
    visiblePhotos = visiblePhotos.filter(photo => (
      selectedAlbum.includes(photo.album?.id || 0)
    ));
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                onClick={() => setSelectedUser(0)}
                className={!selectedUser ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  onClick={() => setSelectedUser(user.id)}
                  className={user.id === selectedUser ? 'is-active' : ''}
                >
                  {user.name}

                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={handelInput}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      type="button"
                      className="delete"
                      aria-label="Close"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                className={`button is-success mr-6 ${selectedAlbum.length !== 0 && 'is-outlined'}`}
                onClick={() => setSelectedAlbum([])}
              >
                All
              </a>

              {albumsFromServer.map(album => (
                <a
                  key={album.id}
                  className={`button mr-2 my-1 ${selectedAlbum.includes(album.id) && 'is-info'}`}
                  href="#/"
                  onClick={() => handleSelectedAlbum(album.id)}
                >
                  {album.title.split(' ')[0]}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visiblePhotos.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            )
            : (
              <table
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Photo name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-down" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Album name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {
                    visiblePhotos.map(photo => (
                      <tr key={photo.id}>
                        <td className="has-text-weight-bold">
                          {photo.id}
                        </td>

                        <td>{photo.title}</td>
                        <td>{photo.album?.title}</td>

                        <td className={photo.user?.sex === 'm'
                          ? 'has-text-link' : 'has-text-danger'}
                        >
                          {photo.user?.name}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="button"
                          >
                            ↑
                          </button>

                          <button
                            type="button"
                            className="button"
                          >
                            ↓
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            )
          }
        </div>
      </div>
    </div>
  );
};
