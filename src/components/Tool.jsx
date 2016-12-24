import React, { Component } from 'react';
import axios from 'axios';
import Styles from './css/tool.css';

export default class Tool extends Component {
  render() {
    return (
      <div className={Styles.toolContainer}>
        <div className={Styles.iconContainer}>
          <img src={this.props.tool.iconUrl}
               className={Styles.icon} />
        </div>

        <div className={Styles.secondContainer}>
         <div className={Styles.nameTierContainer}>
           <div className={Styles.nameContainer}>
             <p className={Styles.name}>{this.props.tool.toolName}</p>
           </div>

           <div className={Styles.tierContainer}>
             <p className={Styles.tier}>{this.props.tool.tier}</p>
           </div>
         </div>

         <div className={Styles.durabilityContainer}>
           <p className={Styles.durability}>Durability: {this.props.tool.durability}</p>
         </div>
       </div>
     </div>
    );
  }
}
