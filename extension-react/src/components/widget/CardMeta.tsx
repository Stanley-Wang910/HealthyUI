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
import { Box, Chip, Grid, LinearProgress } from '@mui/material'
import { VideoType } from '../../api/dto'
import { useQuery } from '@tanstack/react-query'
import { fetchNewsFactCheck } from '../../api/api-calls'
import FactCheck from '../FactCheck'

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

const CardMeta = ({ id, meta }: { id: string; meta: VideoType['huiMeta'] }) => {
  const [expanded, setExpanded] = React.useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['fetchNewsFactCheck', id],
    queryFn: async () => {
      const result = fetchNewsFactCheck(id)
      console.log('Fact check result:', result)
      return result
    },
    enabled: !!id,
    retry: 3
  })

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card
      sx={{
        maxHeight: '300px',
        overflow: 'auto'
      }}
    >
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
        title={'More information about your video'}
        subheader="Below you will find information about this video such as fact checking, helpful links, and a poltical spectrum analysis"
      />

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {meta.placeholder}
        </Typography>
        <Box
          sx={{
            paddingTop: '50px'
          }}
        >
          <Grid container sx={{ alignItems: 'center' }}>
            <Grid item xs={2} spacing={1}>
              <Chip label="left wing" variant="outlined" />
            </Grid>
            <Grid item xs={8}>
              <LinearProgress
                variant="determinate"
                // this should come from another call
                value={meta.spectrum_calc * 100}
              />
            </Grid>
            <Grid item xs={2}>
              <Chip label="right wing" variant="outlined" />
            </Grid>
          </Grid>
        </Box>

        <Box>
          <FactCheck factCheckData={data} isLoading={isLoading} error={error} />
        </Box>
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
          <Typography paragraph> {meta.description} </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}

export default CardMeta
