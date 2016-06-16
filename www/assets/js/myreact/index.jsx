
require('../../sass/main.scss');

// essential for hot module replacement! ie, when re-saving jsx file, the webpage doesn't refresh, but the component does update!
if (module.hot){
  module.hot.accept();
}

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux'; // https://egghead.io/lessons/javascript-redux-passing-the-store-down-with-provider-from-react-redux
import { List, Map } from 'immutable';
import fetch from 'isomorphic-fetch';

const uid = function(){ return Math.random().toString(34).slice(2)}; // hack to create a passable unique id


const IPInfo = {
    id: uid(),
    country: '',
    city: ''
}

const listIPInfos = List([IPInfo]);

// ##############################################################################
// REDUCER   - ( manages state updates )


const ipInfoReducer = function(state = {
  isFetching: false,
  ipInfos: []
}, action) {
    switch(action.type) {
		case 'REQUEST_POSTS': 
            fetchPosts(action.ip);
            return Object.assign({}, state, {
                isFetching: true,
              });
            
      
        case 'RECEIVE_POSTS':
            var newItem = Map(IPInfo).merge({
                id: uid(), 
                country: action.posts.country,
                city: action.posts.city
            }).toObject();
            state.ipInfos.push(newItem);
          return Object.assign({}, state, {
            isFetching: false,
            ipInfos: state.ipInfos,
            lastUpdated: action.receivedAt
          });
            
		default:
			return state;
	}
}


const ipInfoStore = createStore(ipInfoReducer);

function requestPosts(ip) {
  return {
    type: 'REQUEST_POSTS',
    ip
  }
}

function receivePosts(ip, json) {
  return {
    type: 'RECEIVE_POSTS',
    ip,
    posts: json,
    receivedAt: Date.now()
  }
}                                
                                
export function fetchPosts(ip) {
  return fetch(`http://ip-api.com/json/${ip}`)
      .then(response => response.json())
      .then(json => ipInfoStore.dispatch(receivePosts(ip, json)))
} 
                                
                                
// ################################################################################
// HTML COMPONENT



var XmlIPInfoList = React.createClass({
    _handleKeyDown: function (event){// handle ENTER KEY.....
		const isEnterKey = (event.which == 13);
		if(isEnterKey) {
			var val =  '' + event.target.value;		

			// 1) update data
			ipInfoStore.dispatch({type:'REQUEST_POSTS', ip: val });
		}
	},	
    
    render:function () {    
		return (
			<div className='ipChecker'>
				<input type='text'
				className='ip__entry'
				placeholder='Enter IP address and enter'
				onKeyDown={this._handleKeyDown} />

                {this.props.ipInfos.map(k => (
						<li key={k.id} className='ipInfoLine'>                
							Country: {k.country} ;   City: {k.city}  			
						</li>
					))}

			</div>
    	)
  	}
});

// ################################################################################
// SUBSCRIBE HTML COMPONENT TO STATE UPDATES



const IPInfoListSubscriber = connect(
  function mapStateToProps(state) {
    return { ipInfos: state.ipInfos, 
            isFetching: state.isFetching,
            lastUpdated: state.lastUpdated };
  }
)(XmlIPInfoList);


class App extends React.Component {
  render () {
    return (     
	    <Provider store={ipInfoStore}>
            <IPInfoListSubscriber />
  		</Provider>
    );
  }
}

render(<App pagename="first component" />, document.getElementById('app'));

