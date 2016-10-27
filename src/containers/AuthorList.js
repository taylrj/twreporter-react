'use strict'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import AuthorList from '../components/authors/AuthorList'
import AuthorFilter from '../components/authors/AuthorFilter'
import concat from 'lodash/concat'
import forEach from 'lodash/forEach'
import lowerCase from 'lodash/lowerCase'

const _ = {
  forEach: forEach,
  concat: concat,
  lowerCase: lowerCase
}

class AuthorListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // the input keyword for filtering
      keyword: ''
    }
  }

  render() {
    const mockData = {
      inHouse: [ {
        name: '王立柔',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王文彥',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王立柔',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王文彥',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王立柔',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王文彥',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王立柔',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王文彥',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王立柔',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王文彥',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      },{
        name: '王珣沛',
        imgUrl: 'http://i.imgur.com/Clyp3sKb.jpg'
      } ],
      outSource: [ {
        name: '野島剛',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '黃一峰',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '野島剛',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '黃一峰',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '野島剛',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '黃一峰',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '野島剛',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '黃一峰',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '野島剛',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '黃一峰',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '野島剛',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '黃一峰',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '野島剛',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: '黃一峰',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      },{
        name: 'George Chien',
        imgUrl: 'http://i.imgur.com/bH6zB10.png'
      } ]
    }

    let filteredData = {}
    // console.log('state:', this.state)
    if (this.state.keyword) {
      filteredData = this.filter(mockData, this.state.keyword)
    } else {
      filteredData = mockData
    }

    // console.log(filteredData.inHouse)

    return (
      <div>
        <AuthorFilter
          keyword={this.state.keyword}
          passKeyword={this.passKeyword.bind(this)}
          />
        <AuthorList
          inHouseReporters={filteredData.inHouse}
          correspondents={filteredData.outSource}
          keyword={this.state.keyword}
        />
      </div>
    )
  }

  /* Callback function to change the state of the container */
  passKeyword(input) {
    const k = { keyword: input }
    this.setState(k)
  }

  /* Use keyword from state to filter the data for listing */
  filter(originData, keyword) {
    // Make new filtered data object that will be returned
    // Make new propieties(array) that all item.name contain keyword
    let inHouseReporters = []
    inHouseReporters = filterArray(originData.inHouse, keyword)
    // console.log('inHouseReporters:', inHouseReporters)
    let correspondents = []
    correspondents = filterArray(originData.outSource, keyword)
    // console.log('correspondents:', correspondents)
    return { inHouse: inHouseReporters, outSource: correspondents }

    // If item of inputArray contains keyowrd, then concat it to outputArray (Won't change the oring array)
    function filterArray(inputArray,keyword) {
      let outputArray = []
      //Unify keyword to lowercase
      keyword = _.lowerCase(keyword)
      _.forEach(inputArray, function (value) {
        //Unify author name to lowercase
        let checkValue = _.lowerCase(value.name)
        if (checkValue.indexOf(keyword) !== -1) {
          outputArray = _.concat(outputArray, value)
        }
      })
      return outputArray
    }
  }
}

function mapStateToProps() {
  return {
  }
}

AuthorListContainer.contextTypes = {
  device: React.PropTypes.string
}

export { AuthorListContainer }
export default connect(mapStateToProps)(AuthorListContainer)
