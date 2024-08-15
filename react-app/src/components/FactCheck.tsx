import React from 'react'
import { Box, Chip, CircularProgress, Typography } from '@mui/material'
import CardContent from '@mui/material/CardContent'

interface Claim {
  claimDate: string
  claimReview: Array<{
    textualRating: string
    name: string
    site: string
    title: string
    url: string
  }>
  claimant: string
  text: string
}

interface FactCheckQuery {
  claims: Claim[]
  next_page_token: string
  number_of_claims: number
  query: string
}

interface VideoFactCheck {
  [videoId: string]: {
    fact_checks: {
      [query: string]: FactCheckQuery
    }
    query_strings: string[]
  }
}

interface FactCheckProps {
  factCheckData?: VideoFactCheck
  isLoading: boolean
  error: Error | null
}

const FactCheck: React.FC<FactCheckProps> = ({
  factCheckData,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <CardContent>
        <CircularProgress />
      </CardContent>
    )
  }

  if (error) {
    return (
      <CardContent>
        <Typography color="error">
          Error loading fact check data: {error.message}
        </Typography>
      </CardContent>
    )
  }

  if (!factCheckData || Object.keys(factCheckData).length === 0) {
    return (
      <CardContent>
        <Typography>No fact check data available.</Typography>
      </CardContent>
    )
  }

  const videoId = Object.keys(factCheckData)[0]
  const videoData = factCheckData[videoId]

  if (!videoData || !videoData.query_strings || !videoData.fact_checks) {
    return (
      <CardContent>
        <Typography>Invalid fact check data structure.</Typography>
      </CardContent>
    )
  }

  return (
    <CardContent>
      <Typography variant="h6" color="text.primary">
        Fact Check for Video: {videoId}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        style={{ marginTop: '10px' }}
      >
        Fact Check Queries:
      </Typography>
      {videoData.query_strings.map((query, index) => (
        <Chip
          key={index}
          label={query}
          variant="outlined"
          style={{ margin: '5px' }}
        />
      ))}
      <Typography
        variant="body1"
        color="text.primary"
        style={{ marginTop: '20px' }}
      >
        Claims:
      </Typography>
      {Object.entries(videoData.fact_checks).map(([queryString, queryData]) => (
        <Box key={queryString} style={{ marginBottom: '20px' }}>
          <Typography variant="subtitle1" color="text.secondary">
            Query: {queryString}
          </Typography>
          {queryData.claims.map((claim, claimIndex) => (
            <Box
              key={`${queryString}-${claimIndex}`}
              style={{ marginBottom: '15px', marginLeft: '15px' }}
            >
              <Typography variant="body2" color="text.secondary">
                {claim.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Claimant: {claim.claimant} | Date:{' '}
                {new Date(claim.claimDate).toLocaleDateString()} | Link:{' '}
                <a
                  target="_blank"
                  href={claim.claimReview[0].url}
                  rel="noreferrer"
                >
                  Read More
                </a>
              </Typography>
              <br />
              {claim.claimReview.map((review, reviewIndex) => (
                <Chip
                  key={reviewIndex}
                  label={`${review.textualRating} - ${review.name}`}
                  color={
                    review.textualRating.toLowerCase() === 'false'
                      ? 'error'
                      : 'default'
                  }
                  style={{ margin: '5px' }}
                />
              ))}
            </Box>
          ))}
        </Box>
      ))}
    </CardContent>
  )
}

export default FactCheck
