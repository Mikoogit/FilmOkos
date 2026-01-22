import React from "react";

const MovieReviewPage = () => {
  return (
    <>
      

      <div className="movie-review-page">
        {/* Header */}
        <header className="movie-header">
          <div className="movie-header-left">
            <div className="movie-poster" />
            <div className="movie-title">
              <h1>Sonic the Hedgehog 3 <span>(2024)</span></h1>
              <a href="#" className="back-link">← Back to main</a>
            </div>
          </div>
        </header>

        {/* Write Review */}
        <div className="write-review">
          <button>✎ WRITE REVIEW</button>
        </div>

        {/* Reviews */}
        <section className="reviews">

          <article className="review-card">
            <div className="review-header">
              <div className="avatar">CS</div>
              <div>
                <h3>A review by LoremMaster</h3>
                <span className="rating">★ 65%</span>
                <p className="review-date">Written on December 24, 2024</p>
              </div>
            </div>
            <p className="review-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              <span className="read-more"> read the rest.</span>
            </p>
          </article>

          <article className="review-card">
            <div className="review-header">
              <div className="avatar">JD</div>
              <div>
                <h3>A review by IpsumFan</h3>
                <span className="rating">★ 80%</span>
                <p className="review-date">Written on January 24, 2025</p>
              </div>
            </div>
            <p className="review-text">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit.
            </p>
          </article>

          <article className="review-card">
            <div className="review-header">
              <div className="avatar">K</div>
              <div>
                <h3>A review by DolorSit</h3>
                <p className="review-date">Written on January 31, 2025</p>
              </div>
            </div>
            <p className="review-text">
              <strong>Surprisingly enjoyable.</strong> Lorem ipsum dolor sit
              amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </p>
          </article>

        </section>
      </div>
    </>
  );
};

export default MovieReviewPage;
