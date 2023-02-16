import gql from 'graphql-tag'


export const MAPALA_TOTAL_PAYOUT_QUERY = gql`
{
  stats {
    posts {
      totalPayout(category: "mapala")
    }
  }
}
`


export const ACCOUNT_MARKERS_QUERY = gql`
{
  accounts(meta: {notNull: "mapalaProfile.location"}) {
    edges {
      node {
        name
        meta {
          profile {
            profileImage
          }
          mapalaProfile {
            location {
              geometry {
                coordinates
              }
            }
          }
        }
      }
    }
  }
}
`

export const ACCOUNT_QUERY = gql`
query level($username: String!, $blockchain: String!) {
  level(username: $username, blockchain: $blockchain) {
    username,
    avatar
  }
}
`

export const MINIMAL_POST_QUERY = gql`
query minimal_post ($identifier: CommentIdentifier!) {
  post(identifier: $identifier) {
    title
    body
    meta{
      app
      tags
    }
  }
}
`

export const POST_QUERY = gql`
query post ($identifier: CommentIdentifier!,
            $linkifyImages: Boolean,
            )
{
  post(identifier: $identifier) {
    avatar
    permlink
    parentPermlink
    title
    body(linkifyImages: $linkifyImages)
    created
    id
    lastUpdate
    parentAuthor
    author
    comments {
      avatar
      permlink
      parentPermlink
      parentAuthor
      created
      body
      author
    }
    meta{
      tags
      app
    }
  }
}
`

export const POSTS_QUERY = gql`
query posts ($after: String,
             $first: Int!,
             $author: String,
             $orderby: PostOrderingEnum
             )
{
  posts(after: $after,
        first: $first,
        orderBy: $orderby,
        author: $author,
      ),

  {
    edges {
      node {
        author
        owner
        permlink
        meta {
          location
          format
          tags
        }
        title
        created
        body
        thumb
        isVoted(account: $isVoted)  @include(if: $authorized)
        netVotes
        totalPendingPayout
        children
        comments {
          permlink
          owner
          parentPermlink
          parentAuthor
          created
          body
          totalPendingPayout
          author {
            name
            meta {
              profile {
                profileImage
              }
            }
          }
        }
      },
      cursor
    }
  }
}
`


export const DREAMS_QUERY = gql`
query posts ($author: String,
             $blockchain: String!
             )
{
  posts(author: $author,
        blockchain: $blockchain,
        meta: {tags: [$blockchain, "dreams"]}
      ),

  {
    edges {
      node {
        title
        permlink
        author

      },
      cursor
    }
  }
}
`


export const GOALS_QUERY = gql`
query posts ($first: Int!,
             $goalid: Int,
             )
{
  posts(first: $first,
  parentPermlink: "",
  isGoal: true,
  goalId: $goalid
      ),

  {
    edges {
      node {
        permlink
        parentPermlink
        title
        goalId
        body
        created
        host
        id
        lastUpdate
        author
      },
      cursor
    }
  }
}
`


export const COMMENT_QUERY = gql`
query posts ($blockchain: String!,
             $owner: String,
             $after: String,
             $first: Int!,
             $author: String,
             $permlink: String,
             $parentPermlink: String,
             $parentAuthor: String,
             $orderby: PostOrderingEnum,
             $meta: MetaFilterInput,
             )
{
  posts(blockchain: $blockchain,
        owner: $owner,
        first: $first,
        after: $after,
        author: $author,
        permlink: $permlink,
        parentAuthor: $parentAuthor,
        parentPermlink: $parentPermlink,
        orderBy: $orderby, 
        meta: $meta
      ),

  {
    edges {
      node {
        owner
        avatar
        nickname
        permlink
        
        parentPermlink
        title
        body
        commentsIsEnabled
        created
        id
        lastUpdate
        priority
        parentAuthor
        author
        comments {
          
          avatar
          owner
          title
          nickname
          permlink
          parentPermlink
          parentAuthor
          created
          commentsIsEnabled
          isEncrypted
          publicKey
          priority
          body
          author
          meta{
            tags
            app
            type
            name
            sortby
            audio
            images
            ctype
            terminal
            coordinates
            data
          }
        }
        meta{
          tags
          app
          type
          name
          sortby
          audio
          images
          ctype
          terminal
          coordinates
          data
        }
      },
      cursor
    }
  }
}
`


export const MARKET_QUERY = gql`
query markets (
             $blockchain: String!,
             $first: Int!,
             $host: String,
             $is1min: Boolean,
             $is5min: Boolean,
             $is15min: Boolean,
             $is30min: Boolean,
             $is60min: Boolean,
             $is4hour: Boolean,
             $is1day: Boolean,
             $is1week: Boolean
             )
  {
    markets(
        blockchain: $blockchain,
        first:   $first,
        host:    $host,
        is1min:  $is1min,
        is5min:  $is5min,
        is15min: $is15min,
        is30min: $is30min,
        is60min: $is60min,
        is4hour: $is4hour,
        is1day:  $is1day,
        is1week: $is1week 
      ),
  {
    edges {
      node {
        host
        date
        cost
        base
        quote
        basecurr
        quotecurr
      },
      cursor
    }
  }
}
`


export const HOSTS_QUERY = gql`
query hosts (
             $blockchain: String!,
             $app: String
             )
  {
    hosts(
        blockchain: $blockchain,
        app: $app
        ),
  {
    edges {
      node {
        username
        blockchain
        ahost
        totalgrowth
        risk
        roundgrowth
        currentPoolId
        currentPoolNum
        currentCycleNum
        cycleStartId
        symbol
        rootTokenContract
        title
        purpose
      },
      cursor
    }
  }
}
`



export const COREMARKET_QUERY = gql`
query coremarkets (
             $host: String,
             $cycleNum: Int!
             )
  {
    coremarkets(
        host:    $host,
        cycleNum: $cycleNum
        ),
  {
    edges {
      node {
        timestamp
        poolNum
        color
        poolId
        cycleNum
        close
        open
        high
        low   
      },
      cursor
    }
  }
}
`

export const LEVELS_QUERY = gql`
query levels ($blockchain: String!,
              $username: String!,
             $host: String!,
             )
{
  levels(blockchain:$blockchain, username: $username),
  {
    edges {
      node {
        username
        levels(blockchain:$blockchain){
          username 
          referer
          nickname
          count
          expSummBlack(blockchain: $blockchain, host: $host, level: 1)
          expSummWhite(blockchain: $blockchain,host: $host, level: 1)
          totalRecieved(blockchain: $blockchain,host: $host, level: 1)
          levels(blockchain:$blockchain){
            username 
            referer
            count
            expSummBlack(blockchain: $blockchain,host: $host, level: 2)
            expSummWhite(blockchain: $blockchain,host: $host, level: 2)
            totalRecieved(blockchain: $blockchain,host: $host, level: 2)
            levels(blockchain:$blockchain){
              username 
              referer
              count
              expSummBlack(blockchain: $blockchain,host: $host, level: 3)
              expSummWhite(blockchain: $blockchain,host: $host, level: 3)
              totalRecieved(blockchain: $blockchain,host: $host, level: 3)
              levels(blockchain:$blockchain){
                username 
                referer
                count
                expSummBlack(blockchain: $blockchain,host: $host, level: 4)
                expSummWhite(blockchain: $blockchain,host: $host, level: 4)
                totalRecieved(blockchain: $blockchain,host: $host, level: 4)
                levels(blockchain:$blockchain){
                  username 
                  referer
                  count
                  expSummBlack(blockchain: $blockchain,host: $host, level: 5)
                  expSummWhite(blockchain: $blockchain,host: $host, level: 5)
                  totalRecieved(blockchain: $blockchain,host: $host, level: 5)
                  levels(blockchain:$blockchain){
                    username 
                    referer
                    count
                    expSummBlack(blockchain: $blockchain,host: $host, level: 6)
                    expSummWhite(blockchain: $blockchain,host: $host, level: 6)
                    totalRecieved(blockchain: $blockchain,host: $host, level: 6)
                    levels(blockchain:$blockchain){
                      username 
                      referer
                      count
                      expSummBlack(blockchain: $blockchain,host: $host, level: 7)
                      expSummWhite(blockchain: $blockchain,host: $host, level: 7)
                      totalRecieved(blockchain: $blockchain,host: $host, level: 7)
                    }
                  }
                }
              }
            }
          }
        }
      },
      cursor
    }
  }
}
`



export const COUNT_QUERY = gql`
query levels (  $blockchain: String!, 
                $username: String!,
             )
{
  levels(username: $username, blockchain: $blockchain),
  {
    edges {
      node {
        username
        levels(blockchain: $blockchain){
          username 
          referer
          nickname
          count
            levels(blockchain: $blockchain){
            username 
            referer
            count
            levels(blockchain: $blockchain){
              username 
              referer
              count
              levels(blockchain: $blockchain){
                username 
                referer
                count
                levels(blockchain: $blockchain){
                  username 
                  referer
                  count
                  levels(blockchain: $blockchain){
                    username 
                    referer
                    count
                    levels(blockchain: $blockchain){
                      username 
                      referer
                      count
                    }
                  }
                }
              }
            }
          }
        }
      },
      cursor
    }
  }
}
`


export const PROFILE_QUERY = gql`
query levels ($blockchain: String!,
              $username: String!
             )
{
  levels(username: $username, blockchain: $blockchain),
  {
    edges {
      node {
        username
        info
        avatar
        badges{
          backed
          backreason
          comment
          badgetype{
            caption
            description
            iurl
            power
            host
          }
        }
      },
      cursor
    }
  }
}
`

export const ACCOUNTS_QUERY = gql`
query levels ($blockchain: String!,
             )
{
  accounts(blockchain: $blockchain),
  {
    edges {
      node {
        username
        referer
        jsonMetadata
        nickname
        avatar
        
        powers(host:""){
          host
          staked
          power
          delegated
        }
        badges(host: ""){
          backed
          backreason
          comment
          badgetype{
            caption
            description
            iurl
            power
            host
          }
        }
      },
      cursor
    }
  }
}
`


export const PARTICIPANTS_QUERY = gql`
query powers ($blockchain: String!,
              $host: String!,
             )
{
  powers(blockchain: $blockchain, host: $host),
  {
    edges {
      node {
        username
        jsonMetadata
        avatar
        badges{
          backed
          backreason
          comment
          badgetype{
            caption
            description
            iurl
            power
            host
          }
        }
      },
      cursor
    }
  }
}
`
