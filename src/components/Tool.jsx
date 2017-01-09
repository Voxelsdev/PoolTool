import React, { Component } from 'react';
import Styles from './css/tool.css';

export default class Tool extends Component {
  render() {
    return (
      <div className={Styles.toolContainer}>
         <div className={Styles.row}>
           <div className={Styles.leftContainer}>
             <p className={Styles.left}><span className={Styles.key}>Name:</span> {this.props.tool.toolName}</p>
           </div>

           <div className={Styles.rightContainer}>
             <p className={Styles.right}><span className={Styles.key}>Tier:</span> {this.props.tool.tier}</p>
           </div>
         </div>
         <div className={Styles.row}>
           <div className={Styles.leftContainer}>
              <p className={Styles.left}><span className={Styles.key}>Durability:</span> {this.props.tool.durability}</p>
            </div>
            <div className={Styles.rightContainer}>
              <p className={Styles.right}><span className={Styles.key}>Type:</span> {this.props.tool.type}</p>
            </div>
        </div>
     </div>
    );
  }
}
