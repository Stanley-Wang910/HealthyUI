import * as React from 'react'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, Chip, CircularProgress, Grid, LinearProgress } from '@mui/material'
import { VideoType, VideoFactCheck } from '../../api/dto'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

type VideoItem = VideoType[string]['items'][0]

const CardMeta = ({ 
  meta, 
  factCheckData,
  isFactCheckLoading 
}: { 
  meta: VideoItem;
  factCheckData?: VideoFactCheck;
  isFactCheckLoading: boolean;
}) => {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const spectrumCalc = 0.5; // Replace with actual value if available
  const placeholder = "Placeholder text";

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            !
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={meta.snippet.title}
        subheader="This is a static subhead about our video meta"
      />

      <CardContent>
        {isFactCheckLoading ? (
          <CircularProgress />
        ) : factCheckData ? (
          <>
        <Typography variant="body2" color="text.secondary">
          Fact Check Queries:
        </Typography>
        {factCheckData.query_strings.map((query, index) => (
          <Chip key={index} label={query} variant="outlined" style={{margin: '5px'}} />
        ))}
        <Typography variant="body1" color="text.primary" style={{marginTop: '20px'}}>
              Claims:
        </Typography>
        {Object.entries(factCheckData.fact_checks).map(([query, check]) => (
            check.claims.map((claim, claimIndex) => (
              <Box key={`${query}-${claimIndex}`} style={{marginBottom: '15px'}}>
                <Typography variant="body2" color="text.secondary">
                  {claim.text}
                </Typography>
                {claim.claimReview.map((review, reviewIndex) => (
                  <Chip 
                    key={reviewIndex}
                    label={`${review.textualRating} - ${review.name}`}
                    color={review.textualRating.toLowerCase() === 'false' ? 'error' : 'default'}
                    style={{margin: '5px'}}
                  />
                ))}
              </Box>
            ))
          ))}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {placeholder}
          </Typography>
        )}
      </CardContent>

      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph> {meta.snippet.description} </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default CardMeta
