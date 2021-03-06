import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemTitle,
  Divider,
  Wrapper,
  FlatButton,
} from './styled';
import { Link, withRouter } from 'react-router-dom';
import ProgressBar from '../ProgressBar';
import { reinitializeScore } from '../../helpers/helpers';

const ResetButton = props =>
  withRouter(({ history, resetScore }) => (
    <FlatButton
      onClick={() => {
        resetScore();
        history.push('/');
      }}
    >
      Reset Progress
    </FlatButton>
  ))(props);

class Sidebar extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    score: PropTypes.object.isRequired,
    updateScore: PropTypes.func.isRequired,
  };

  resetScore = () => {
    const { score, updateScore } = this.props;
    const newScore = reinitializeScore(score);
    updateScore(newScore);
  };

  getBookScores(book) {
    const CORRECT = 'CORRECT';
    return {
      correct:
        book.chapters.reduce((b, ch) => {
          return (
            b +
            ch.questions.reduce((acc, qn) => {
              return acc + (qn.status === CORRECT ? 1 : 0);
            }, 0)
          );
        }, 0) || 0,
      possible:
        book.chapters.reduce((b, ch) => {
          return b + ch.questions.length;
        }, 0) || 0,
    };
  }

  render() {
    const score = this.props.score;
    const books = this.props.books;
    const scoreAnswered = score.correct + score.incorrect;
    const scorePct = Math.round((100 * score.correct) / scoreAnswered) || 0;

    return (
      <Wrapper>
        <List>
          <ListItemTitle>Progress</ListItemTitle>
          <ListItem>
            <ProgressBar score={score} />
          </ListItem>
          <ListItem>
            <p>
              You've answered <strong>{score.correct}</strong> out of{' '}
              <strong>{scoreAnswered}</strong> (<strong>{scorePct}%</strong>)
              questions correctly.
            </p>
            <p>
              <strong>{score.possible - scoreAnswered}</strong> left to answer.
            </p>
          </ListItem>

          <Divider />

          <ListItemTitle>Books</ListItemTitle>
          {books.map((book, index) => (
            <Link key={index} style={{ textDecoration: 'none' }} to={book.url}>
              <ListItem>
                {`${book.title} (${
                  this.getBookScores(score.books[index]).correct
                } /
                  ${this.getBookScores(score.books[index]).possible})`}
              </ListItem>
            </Link>
          ))}
        </List>
        <section>
          <ResetButton resetScore={this.resetScore} />
        </section>
      </Wrapper>
    );
  }
}

export default Sidebar;
