import React from 'react';
import {
  NewsContainer,
  MainTitle,
  Card,
  NewsHeadline,
  NewsParagraph,
  ReadMoreButton
} from './styled';

import { newsContent } from './content';

const NewsCard: React.FC = () => {
  return (
    <NewsContainer>
      <MainTitle>Notícias</MainTitle>
      <Card>
        <NewsHeadline>{newsContent.title}</NewsHeadline>
        <NewsParagraph>{newsContent.paragraph}</NewsParagraph>
        <ReadMoreButton>Leia mais</ReadMoreButton>
      </Card>
    </NewsContainer>
  );
};

export default NewsCard;