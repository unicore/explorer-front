import config from '@/config/index'
// import router from '@/router'
import router from '@/router'

export function get_meta(state){
  var meta = state.host_obj.meta
  
  if (meta){
    if (meta.constructor == Object)
      return meta
  }

  try {
    meta = JSON.parse(meta)
  } catch(e){
    meta = {}
  }
  
  return meta
}

export function get_goal_display_mode(state, getters){
  if (state.host_obj.meta){
    if (getters['get_meta'].goalsDisplayMode)
      return getters['get_meta'].goalsDisplayMode
    else return "goals"
  }
  else return "goals"
}

export function get_home (state) {
  
  let home = state.cmscontent.find(el => el.type == "home")
  if (home) return 'manifest'
    else return home.content
}

export function get_app (state) {
  let mainpage = state.cmscontent.find(el => el.type == "mainpage")
  if (mainpage)
    return state.cmscontent.find(el => el.type == "mainpage").content
  else {
    return {
      descriptor: "",
      slides: [
        {
          name: 'main',
          img: null,
          icon: "style",
          text: "текст слайда 1"
        },
        {
          name: '2',
          img: null,
          icon: "tv",
          text: "текст слайда 2"
        },
        {
          name: '3',
          img: null,
          icon: "layers",
          text: "текст слайда 3"
        },
        {
          name: '4',
          img: null,
          icon: "map",
          text: "текст слайда 4"
        },




      ]


    }


  }
}



export function get_tour_config (state) {


 

  // router.push({name: 'registrator'})
  

  var defaultTourConfig = {
    // "createWheelTour": {
    //   "stopEducationAfter": true,
    //   "redirectAfterStop": "",
    //   "steps": [
    //   {
    //         "target": '#header',  // We're using document.querySelector() under the hood
    //         "content": `Охотник на Силу управляет своей Сферой Жизни, распределяя своё внимание по ней в действиях.`,
    //         "params": {
    //           "highlight": true,
    //           "enableScrolling": false,
    //           // placement: 'bottom'
    //         },

    //         "beforeSlide": [
                
    //         ]
    //   },
    //   {
    //         "target": '#createWheelSectors',  // We're using document.querySelector() under the hood
    //         "content": `Создай свою Сферу Жизни и честно опиши состояние каждого сектора, в котором ты будешь вести свою Охоту.`,
    //         "params": {
    //           "highlight": true,
    //           "enableScrolling": false,
    //           // placement: 'bottom'
    //         },

    //         "beforeSlide": [
                
    //         ]
    //   },
    //   {
    //         "target": '#createWheelContinueButton',  // We're using document.querySelector() under the hood
    //         "content": `Нажми сюда, когда будешь готов начать игру с Коллективным Разумом.`,
    //         "params": {
    //           "highlight": true,
    //           "enableScrolling": false,
    //           // placement: 'bottom'
    //         },

    //         "beforeSlide": [
                
    //         ]
    //   },
    //   ]
    // },

   // "lifeTour": {
   //    "stopEducationAfter": true,
   //    "redirectAfterStop": "life",
   //    "redirectCommunity": "self",
   //    "steps": [
      // {
      //       "target": '#lifeWheelBlock',  // We're using document.querySelector() under the hood
      //       "content": `Равномерно расширяй свою Сферу Жизни, выполняя действия.`,
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": false,
      //         // placement: 'bottom'
      //       },

      //       "beforeSlide": [
                
      //       ]
      // },
      //     {
      //       "target": '#lifeWheel',  // We're using document.querySelector() under the hood
      //       "content": `Каждое действие расширяет тот сектор Сферы Жизни, к которому оно принадлежит. `, 
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": true,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
      //           {
      //             "type": "emit",
      //             "params": {
      //               "what": "addPowerToWheel",
      //               "params": {
      //                 "sector": 0,
      //                 "quantity": 1
      //               }
      //             }
      //           },
      //         ]
      //     },
      //     {
      //       "target": '#lifeWheel',  // We're using document.querySelector() under the hood
      //       "content": `Расширение одного сектора выводит другие сектора из баланса.. `, 
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": false,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
      //         {
      //             "type": "emit",
      //             "params": {
      //               "what": "addPowerToWheel",
      //               "params": {
      //                 "sector": 1,
      //                 "quantity": 2
      //               }
      //             }
      //           },  
      //       ]
      //     },
      //     {
      //       "target": '#lifeWheel',  // We're using document.querySelector() under the hood
      //       "content": `Поддерживай равномерное наполнение секторов своим вниманием, не допускай провалов и будь предельно честен с собой. `, 
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": false,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
      //         {
      //             "type": "emit",
      //             "params": {
      //               "what": "addPowerToWheel",
      //               "params": {
      //                 "sector": 2,
      //                 "quantity": 2
      //               }
      //             }
      //           },  
      //       ]
      //     },
      //     {
      //       "target": '#powerLimitBlock',  // We're using document.querySelector() under the hood
      //       "content": `Чем лучше сбалансировано Колесо Жизни - тем ближе ты к своему пределу Силы в текущий момент.`, 
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": true,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
      //           {
      //             "type": "emit",
      //             "params": {
      //               "what": "addPowerToWheel",
      //               "params": {
      //                 "sector": 3,
      //                 "quantity": 3
      //               }
      //             }
      //           },
      //       ]
      //     },
      //     {
      //       "target": '#addGoal',  // We're using document.querySelector() under the hood
      //       "content": `Бросай вызовы себе сам или получай их от Коллективного Разума Охотников. `,
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": true,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
                
      //       ]
      //     },
      //     {
      //       "target": '#actionsTab',  // We're using document.querySelector() under the hood
      //       "content": `Построй карту действий для своего вызова или получи её у Коллективного Разума.`,
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": false,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
      //           {
      //             "type": "emit",
      //             "params": {
      //               "what": "selectLifeTab",
      //               "params": {
      //                 "tab": "actions",
      //               }
      //             }
      //           },
      //       ]
      //     },
      //     {
      //       "target": '#discussTab',  // We're using document.querySelector() under the hood
      //       "content": `Не все действия подходят для тебя. Научись отличать то, что не твоё, от того, что ты просто боишься.`,
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": true,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
      //           {
      //             "type": "emit",
      //             "params": {
      //               "what": "selectLifeTab",
      //               "params": {
      //                 "tab": "discuss",
      //               }
      //             }
      //           },
      //       ]
      //     },

      //     {
      //       "target": '#actionsTab',  // We're using document.querySelector() under the hood
      //       "content": `Алгоритм действий уточняется и изменяется по мере того, как Коллективный Разум лучше узнаёт тебя.`,
      //       "params": {
      //         "highlight": true,
      //         "enableScrolling": true,
      //         // placement: 'bottom'
      //       },
      //       "beforeSlide": [
                
      //       ]
      //     },
          // {
          //   "target": '#header',  // We're using document.querySelector() under the hood
          //   "content": `Познакомься с другими Охотниками и Коллективным Разумом, который они составляют.`,
          //   "params": {
          //     "highlight": true,
          //     "enableScrolling": true,
          //     // placement: 'bottom'
          //   },
          //   "beforeSlide": [
                
          //   ]
          // },
          // {
          //   "target": '#allPartners',  // We're using document.querySelector() under the hood
          //   "content": `Каждый Охотник ведёт свою охоту на Силу и играет с другими Охотниками, бросая им вызовы.`,
          //   "params": {
          //     "highlight": true,
          //     "enableScrolling": true,
          //     // placement: 'bottom'
          //   },
          //   "beforeSlide": [
          //        {
          //         "type": "timeout",
          //         "params": {
          //           "sec": 1
          //         }
          //       },
          //       {
          //       "type": "redirect",
          //       "params": {
          //         "name": "home",
          //         "routeParams": {
                    
          //         }
          //       }
          //       },
          //   ]
          // },
          // {
          //   "target": '#allPartners',  // We're using document.querySelector() under the hood
          //   "content": `Наблюдай и направляй общий процесс развития в Коллективном Разуме.`,
          //   "params": {
          //     "highlight": true,
          //     "enableScrolling": true,
          //     // placement: 'bottom'
          //   },
          //   "beforeSlide": [
                
          //       {
          //       "type": "redirect",
          //       "params": {
          //         "name": "home",
          //         "routeParams": {
                  
          //         }
          //       }
          //       },
          //   ]
          // },
    //       {
    //         "target": '#header',  // We're using document.querySelector() under the hood
    //         "content": `Славной Охоты тебе! И безупречного пути, Воин!..`,
    //         "params": {
    //           "highlight": true,
    //           "enableScrolling": true,
    //           // placement: 'bottom'
    //         },
    //         "beforeSlide": [
              
    //         ]
    //       },

    //   ]
    // },

    "homeTour": {
      "startEducationPage": 'index',
      "startEducationPageParams": {community: 'community'},
      "redirectAfterStop": 'home',
      "redirectAfterParams": {community: null},
      "stopEducationAfter": true,
      "startNextTour": false,
      "nextTour": "",
      "steps" : [
        {
              "target": '#header',  // We're using document.querySelector() under the hood
              "content": `<img src="https://cont.ws/uploads/posts2/121785.jpg" style="width: 100%"> "Охота на Силу" - это древняя игра Южно-Американских шаманов, передаваемая из поколение в поколение.`,
              // "header": {
              //   "title": 'Добро Пожаловать',
              // },
              "params": {
                "enableScrolling": false,
                "highlight": true,
                // "placement": 'bottom'
              },
              "beforeSlide": [
                {
                  "type": "rightDrawer",
                  "params": {
                    "status": true
                  }
                },
                // {
                //   "type": "leftDrawer",
                //   "params": {
                //     "status": false
                //   }
                // },
              ]
        },
        { 
              "target": '#life-menu',  // We're using document.querySelector() under the hood
              // "header": {
              //   "title": '',
              // },
              "content": `<img src="https://avatars.mds.yandex.net/get-zen_doc/98844/pub_5f4937ebae5a5a5a8bbf60a1_5f493864ef735e13d337cc93/scale_1200" style="width: 100%"> Шаманы учили, что человек - это его внимание. То, куда направлено внимание - то и есть человек.`,
              "params": {
                "enableScrolling": false,
                "highlight": true,
                // "placement": 'top'
              },
              
              
              "beforeSlide": [
                
              ]
        },
        {
              "target": '#header',  // We're using document.querySelector() under the hood
              // "header": {
              //   "title": '',
              // },
              "content": `<img src="https://thumb.tildacdn.com/tild6164-3238-4965-a338-646565303139/-/format/webp/photo.png" style="width: 100%"> Внимание измеряется в действиях. Если ты хочешь изменить свою жизнь - измени свои действия.`,
              "params": {
                "enableScrolling": false,
                "highlight": true,
                "placement": 'top'
              },
              
              
              "beforeSlide": [
                
              ]
        },
        // {
        //       "target": '#header',  // We're using document.querySelector() under the hood
        //       // "header": {
        //       //   "title": '',
        //       // },
        //       "content": `Часто мы не видим то, что `,
        //       "params": {
        //         "enableScrolling": false,
        //         "highlight": true,
        //         "placement": 'top'
        //       },
              
              
        //       "beforeSlide": [
                
        //       ]
        // },
        {
              "target": '#header',  // We're using document.querySelector() under the hood
              // "header": {
              //   "title": '',
              // },
              "content": `<img src="https://avatars.mds.yandex.net/get-zen_doc/163385/pub_5b0efca320ea2bd294a056b2_5b0efcd3482677af3cfafb3e/scale_1200" style="width: 100%;"> "Охота на Силу" - это трансформационная игра с Коллективным Разумом, бросающим тебе вызов.`,
              "params": {
                "enableScrolling": false,
                "highlight": true,
                "placement": 'top'
              },
              
              
              "beforeSlide": [
                
              ]
        },
        {
              "target": '#header',  // We're using document.querySelector() under the hood
              // "header": {
              //   "title": '',
              // },
              "content": `<img src="https://fitness-dlya-vseh.ru/wp-content/uploads/2018/06/t2.jpg" style="width: 100%"> Принимаешь вызов и совершаешь действие - познаешь себя, повышаешь свой уровень энергии, и приближаешься к доступному тебе сегодня пределу силы.`,
              "params": {
                "enableScrolling": false,
                "highlight": true,
                "placement": 'top'
              },
              
              
              "beforeSlide": [
                
              ]
        },
        {
              "target": '#header',  // We're using document.querySelector() under the hood
              // "header": {
              //   "title": '',
              // },
              "content": `<img src="https://lh3.googleusercontent.com/proxy/Cm_2bBDQOUp6nfHcuCXKNAgWfWBTGNwydP_cHiPvKth6hkTgGVgh1i3lMFYa8rKYsGGNpVFM41rmtotC" style="width: 100%"> Будь частью Колективного Разума, бросай вызовы Охотникам на Силу и наблюдай за развитием их жизней. `,
              "params": {
                "enableScrolling": false,
                "highlight": true,
                "placement": 'top'
              },
              
              
              "beforeSlide": [
                
              ]
        },
        {
              "target": '#header',  // We're using document.querySelector() under the hood
              // "header": {
              //   "title": '',
              // },
              "content": `<img src="https://svetlica-mama-blogger.ru/wp-content/uploads/2018/04/numerologiya-predskazyvaet-sudbu-cheloveka.jpg" style="width: 100%"> Сыграй в древнюю игру саморазвития для себя. Принимаешь ли ты этот вызов?`,
              "params": {
                "enableScrolling": false,
                "highlight": true,
                "placement": 'top'
              },
              
              
              "beforeSlide": [
                
              ]
        },

        // {

        //       "target": '#homeTarget',  // We're using document.querySelector() under the hood
        //        "header": {
        //         "title": 'Изучите платформы',
        //        },
        //       "content": `Выберите своё пространство для сотрудничества и развивайте его, получая награды.`,
             
        //       "params": {
        //         "enableScrolling": false,
        //         "highlight": true,
        //         "placement": 'top'
        //       },
        //       "beforeSlide": [
        //         {
        //           "type": "timeout",
        //           "params": {
        //             "sec": 3
        //           }
        //         },
        //         {
        //           "type": "redirect",
        //           "params": {
        //             "name": "index",
        //             "routeParams":{
        //               "community": "community"
        //             }
        //           }
        //         },
        //       ]
        // // },
        // // {
        // //       "target": '#createHostButton',  // We're using document.querySelector() under the hood
        // //       "header": {
        // //         "title": 'Создайте платформу',
        // //       },
        // //       "content": `И пригласите партнёров к сотрудничеству в процессе её создания.`,
        // //       "params": {
        // //         "enableScrolling": false,
        // //         "highlight": false,
        // //         // "placement": 'top'
        // //       },
              
              
        // //       "beforeSlide": [
                
        // //       ]
        // },

        
    ]
    

  }
  
  }


  let tourconfig = state.cmscontent.find(el => el.type == "tourconfig")

  if (tourconfig){
    let content =  state.cmscontent.find(el => el.type == "tourconfig").content
    //TODO merge with defaultTourConfig
    

    let merged = {...defaultTourConfig, ...content};
    // merge(defaultTourConfig, )
    // merged = beforeToFunction(merged)
    return merged

  }

  else {
  
    // defaultTourConfig = beforeToFunction(defaultTourConfig)
    return defaultTourConfig
  
  }
}




export function get_main_config (state) {

  var defaultObj = {
      "rightDrawer": {
        "hide": false,
        "showMenu": false,
        "fullWidth": true
      },
      "leftDrawer": {
        "hideBeforeAuth": false,
        "showDiscuss": false,
        "showHosts": false,
        "showBarsButton": true,        
        "showRssButton": true,
        "defaultView": "profile", //discuss
      },
      "homePage": {
        "showBeforeAuth": "globe",
        "targetTitle": "ПАРТНЁРЫ",
        "targetDescriptor": "создай альтернативную версию своей реальности в сообществе единомышленников",
        "target": "globe",
        "targetProps": {
          "showHostTitle": true,
          "showHostPurpose": true,
          "showPartnerCan": false,
          "showPartnerNeed": false,
          "showPartnerDream": false,
          "showPartnerAbout": false,
        },

      },
      "globe": {
        "showProducers": false,
        "showAhosts": true,
        "openPageOnScale": 'index',
        "producers": {
          "more": "приблизиться",
          "size": 0.25,
          "color": "#009688bd",
          "radius": 1,
          "secondMapRadiusInMeters": 100000, 
        },
        "ahosts": {
          "more": "приблизиться",
          "size": 0.25,
          "color": "#f443369c",
          "radius": 1,
          "secondMapRadiusInMeters": 100000, 
        },
      },
      "profile": {
        "showChats": false,
        "guestChatButtonLink": "https://t.me",
        "partnerChatButtonLink": "https://t.me",
        "showCreateHostButton": false,
        "createButtonText": "Создать центр",
        "adminPanelButtonText": "Панель управления",
        "moveToHostButtonText": "Домой",
        "targetHostPage": "index",
        "partnerText": "партнёр",
        "hostText": "круг",
        "guestText": "гость",
        "textProfile": [
          {
            "type": "text",
            "model": "about",
            "label": "О себе",
            "value": "",
            "autogrow": true
          },
          {
            "type": "text",
            "model": "mydream",
            "label": "Образ будущего (мечта)",
            "value": "",
            "autogrow": true
          },          
        ]
      },
      "registratorPage": {
        "redirectAfterRegisterTo": "home",
        "cashbackQuants": 0,
        "mustSetReferer": false,
      },
      "discussPage": {
        "showEditOnlyForHost": false,
        "showMap": true,
      },
      "goals":{
        "createGoalButtonText": "Создать цель",
        "showInputTargetBudget": true,
      },
      
      "centersPage":{
        "createHostButton": true,
        "createHostButtonText": "Создать центр"
      }, 

      "createPage": {
        "createPanelTitle": "Создать центр",
        "createPanelButtonText": "Создать",
        "createPanelText": "",
        "createButtonsDisabled": false,
        "createButtonsDisabledWhy": "Запуск центров временно недоступен в связи с подготовкой соответствующего релиза. ",
        "createButtonsDisabledButtonText": "Вы можете принять участие в его разработке.",
        "createButtonsDisabledWhyMore": "https://intellect.run",
      },
      "p2pPage": {
        "saleMode": true,
        "showRate": true,
        "canWithdraw": true,
        "showEducation": false,
        "showOneColumn": true,
        "showCreator": true,
        "sellButtonText": "получить помощь", //продать
        "buyButtonText": "оказать помощь", //купить,
        "spread": 0.05,
        "showVesting": true,
      },
      "corePage": {
        "showDepositButton": true,
      },
      "mastersPage": {
        "mastersTitle": "Мастера [Раздел в разработке]",
        "mastersDescriptor": "Каждый мастер может заявить о себе и принять учеников. "
      },
      "lifePage": {
        "createWheelTitle": "Создать Сферу Жизни",
        "createWheelText": "Ты находишься в центре своей Сферы Жизни. Вокруг тебя мир, в который ты направляешь своё внимание. Каждое направление твоего внимания может получить имя.",
        "createWheelImage": "",
        "showGlobalComments": true,
        "showLocalComments": false,
        "needStartTourAfterSetup": true,
        "tourNameForStart": "lifeTour",
        "goalAccepted": "цель принята",
        "goalDeclined": "цель отлонена",
        "goalPending": "ожидание",
        "goalReported": "отчёт получен",
        "goalCompleted": "цель достигнута",
        
      },
      "tasks": {
        "createTaskButtonText": "",
        "disabledMarathonTask": "Это действие отмечено как временно недоступное. Вероятно, оно еще в процессе производства. ",
        "showTaskType": true,
        "showRegular": false,
        "defaultRegularType": false,
        "defaultTaskType": "public",
        "showTags": false,
        "showCoins": true,
        "showDoer": false,
        "showYoutube": false,
        "showReportType": false,
        "showMap": true,
        "defaultReportType": "text",
        "showDates": false,
        "showReportText": true,
        "showWithBadgeOption": true,
        "defaultWithBadgeOption": true,
        "showBadgeChanger": true,
        "showWithBadge": true,
        "defaultReportText": "Напишите отчёт",
        "disableDiscuss": false,
        "showCreator": false,
      },
      
      "partnerPage": {
        "moveToPartnerPage": "index",
        "minUSDAmountForShow": 0,
      },
      "wallets":{
        "hideUsd": false,
        "usd_color": 'red',
        "usd_precision": 4,
        "showPowerWallets": false
      },
      "createConfig": {
        "presets": [
          {
            "name": "Персональный центр",
            "descriptor": "Центр осуществляет консультации о том и вот об этом.",
            "img": "/statics/preset-images/personal-center.png",
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,

            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
          
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
            ],

            "skipSteps": [],
            "startAfterSetParams": true,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": true,
            "tourNameForStart": "createWheelTour"
                 
          },


          {
            "name": "Консультационный центр",
            "descriptor": "Центр осуществляет консультации о том и вот об этом.",
            "img": "/statics/preset-images/consult-center.png",
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,
            
            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
          
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
            ],

            "skipSteps": [],
            "startAfterSetParams": true,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": true,
            "tourNameForStart": "createWheelTour"
                 
          },

          {
            "name": "Жилой центр",
            "descriptor": "Центр осуществляет консультации о том и вот об этом.",
            "img": "/statics/preset-images/life-center.png",
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,
            
            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
          
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
            ],

            "skipSteps": [],
            "startAfterSetParams": true,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": true,
            "tourNameForStart": "createWheelTour"
                 
          },


          {
            "name": "Туристический центр",
            "descriptor": "Центр осуществляет консультации о том и вот об этом.",
            "img": "/statics/preset-images/tourist-center.png",
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,
            
            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
          
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
            ],

            "skipSteps": [],
            "startAfterSetParams": true,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": true,
            "tourNameForStart": "createWheelTour"
                 
          },


          {
            "name": "Производственный центр",
            "descriptor": "Центр осуществляет консультации о том и вот об этом.",
            "img": "/statics/preset-images/prod-center.png",
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,
            
            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
            
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
              
            ],

            "skipSteps": [],
            "startAfterSetParams": true,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": true,
            "tourNameForStart": "createWheelTour"
                 
          },


          {
            "name": "Исследовательский центр",
            "descriptor": "Центр осуществляет консультации о том и вот об этом.",
            "img": "/statics/preset-images/lab-center.png",
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,
            
            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
          
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
            ],

            "skipSteps": [],
            "startAfterSetParams": true,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": true,
            "tourNameForStart": "createWheelTour"
                 
          },


          {
            "name": "Образовательный центр",
            "descriptor": "Центр осуществляет консультации о том и вот об этом.",
            "img": "/statics/preset-images/edu-center.png",
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,
            
            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
          
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
            ],

            "skipSteps": [],
            "startAfterSetParams": true,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": true,
            "tourNameForStart": "createWheelTour"
                 
          },


          {
            "name": "Бизнес-центр",
            "descriptor": "Бизнес-центр",
            "img": "/statics/preset-images/biz-center.png",
            
            "title": "", //персональная живая лаборатория
            "purpose": "", //игра: охота на силу
            "root_token_contract": "eosio.token",
            "root_token_symbol": config.core_symbol,
            "root_token_precision": 4,

            
            "total_shares": "0",
            "quote_amount": "0.0000",
            "quote_token_contract": "eosio.token",
            "quote_symbol": config.core_symbol,
            "quote_precision": 4,


            "levels": [50,25,12.5,6.25,3.125,1.5625,1.5625],

            "referral_percent": 0,
            "dacs_percent": 50,
            "cfund_percent": 0,
            "hfund_percent": 50,

            "voting_model": "only_up", //up_and_down
            "gtop": 0, 
            "emission_percent": 100,
            "consensus_percent": 0,
            
            "spiral": {
              "size_of_pool": 10000,
              "overlap": 5,
              "profit_growth": 200,
              "base_rate": 100,
              "loss_percent": 30, 
              "pool_limit": 49,
              "pool_timeout": 259200,
              "priority_seconds": 86400,
            },

            "standartMenu": [
              {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
              
              {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
              {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
              {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
              
              {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
              // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
              {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
                  
              {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
              {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
              {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
              {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
              
              {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
              {name: 'Банка', route_name: "core", icon: "fas fa-adjust", middleware: false, checked: false, priority: 13},
              {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
              {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
              {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 16},
              // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
              {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 18},
          
              {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19},
            ],

            "skipSteps": [],
            "startAfterSetParams": false,
            
            "startPageAfterSetup": "life", 
            "needStartTourAfterSetup": false,
            "tourNameForStart": "createWheelTour"
                 
          },

        ],
      }
        
    }


  let mainconfig = state.cmscontent.find(el => el.type == "mainconfig")
  // console.log("CONFIG FROM BC", config, state)

  if (mainconfig){
    let content =  state.cmscontent.find(el => el.type == "mainconfig").content
    //TODO merge with defaultObj
    
    // let merged = {...defaultObj, ...content};
    let merged = merge(defaultObj, content)

    // console.log("mergedConfig", defaultObj, content)
    // console.log("merged", merged)

    return merged
  }
  else {
    return defaultObj
  }
}


  function merge(obj, target) {
    for (const [index, el] of Object.entries(obj)) {

    // obj.map((el, index) => {
      if (el instanceof Object && target[index])
        obj[index] = merge(el, target[index])  
      else {
        obj[index] = target && (target[index] || target[index] == true || target[index] == false) ? target[index] : obj[index]
      }
    }
    // console.log('preMerged', obj, target)
    return obj
  }


export function get_manifest (state) {
  return state.cmscontent.find(el => el.type == "manifest")
}

export function get_maintype (state) {
  let maintype = state.cmscontent.find(el => el.type == "maintype")
  if (!maintype)
    return {
      main_type: "as_welcome"
    }
  return maintype.content
}


export function get_menu (state) {
  var instrument_name = ""
  var instrument_icon = ""

  if (state.host_obj.type == "tin"){
    instrument_name = "Банка"
    instrument_icon = "fas fa-adjust"
  }
  if (state.host_obj.type == "pot"){
    instrument_name = "Котел"
    instrument_icon = "fas fa-glass-whiskey"
  }
  if (state.host_obj.type == "bw"){
    instrument_name = "Двойная Спираль"
    instrument_icon = "fas fa-signal"
  }
  

  var standart = [
      {name: 'Архитекторская', route_name: "admin", icon: "fas fa-scroll", middleware: false, checked: true, priority: 1},
      
      {name: 'Манифест', route_name: "index", icon: "fas fa-scroll", middleware: false, checked: true, priority: 2},
      {name: 'Кодекс', route_name: "rules", icon: "fas fa-gavel", middleware: false, checked: true, priority: 3},
      {name: 'Команда', route_name: "team", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
      {name: 'Вакансии', route_name: "vacancies", icon: "fas fa-users", middleware: false, checked: true, priority: 4},
      {name: 'Лаборатория', route_name: "life", icon: "fas fa-life-ring", middleware: false, checked: true, priority: 5},
      // {name: 'Партнеры', route_name: "partners", icon:"fas fa-handshake" , middleware: false, checked: true, priority: 6},
      {name: 'Рынок Силы', route_name: "power-market", icon: "spa", middleware: false, checked: true, priority: 7},
          
      {name: 'Фракции Силы', route_name: "power", icon: "spa", middleware: false, checked: true, priority: 8},
      {name: 'Цели', route_name: "goals", icon:"fas fa-bullseye", middleware: false, checked: true, priority: 9},
      {name: 'Задачи', route_name: "tasks", icon: "fab fa-galactic-republic", middleware: false, checked: true, priority: 10},
      {name: 'Награды', route_name: "badges", icon: "fas fa-medal", middleware: false, checked: true, priority: 11},
      
      {name: 'Академия', route_name: "academy", icon:"fas fa-graduation-cap", middleware: false, checked: true, priority: 12},
      {name: instrument_name, route_name: "core", icon: instrument_icon, middleware: false, checked: true, priority: 13},
      {name: 'Касса взаимопомощи', route_name: "p2p", icon: "fas fa-hands-helping", middleware: false, checked: true, priority: 14},
      {name: 'Сотрудничество', route_name: "projects", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 15},
      {name: 'Мастера', route_name: "masters", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 16},
      
      {name: 'События', route_name: "events", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 17},
      {name: 'Мои NFT', route_name: "nft", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 17},
      {name: 'Рынок NFT', route_name: "nft-market", icon: "fas fa-calendar-alt", middleware: false, checked: true, priority: 17},
      
      // {name: 'Форум', route_name: "log", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 17},
      
      {name: 'Коллективный Разум', route_name: "mind", icon: "fas fa-clipboard-list", middleware: false, checked: false, priority: 19, params: {blockchain: config.ual.rootChain}},
      {name: 'Обозреватель', route_name: "explorer", icon: "fas fa-project-diagram", middleware: false, checked: true, priority: 20},
      // {name: 'Создать клуб', route_name: "create", icon: "fab fa-creative-commons-remix", middleware: false, checked: true},
    ]

  var menu = state.cmscontent.find(el => el.type == "menu")
  
  // console.log("on MENU", menu)

  if (menu && menu.content){
    standart.map((el, index) => {
      let user_menu_el = menu.content.find(user_el => user_el.route_name == el.route_name)
      
      // console.log("founded el", user_menu_el )
      
      if (user_menu_el){

        let tmp_user_menu_el = JSON.parse(JSON.stringify(user_menu_el))
        standart[index] = tmp_user_menu_el
        standart[index].checked = tmp_user_menu_el.checked
        standart[index].middleware = tmp_user_menu_el.middleware
        standart[index].is_external = tmp_user_menu_el.is_external
        standart[index].priority = tmp_user_menu_el.priority
        standart[index].params = tmp_user_menu_el.params
        
        
      } else {

        standart[index].checked = false
        standart[index].middleware = false
        standart[index].priority = 0
      }
    })

    // console.log("ON SORT", standart)
    let ext = menu.content.filter(el => el.is_external == true)
    standart = standart.concat(ext)
    
    //TODO sort by priority
    standart.sort((a, b) => a.priority - b.priority)
    // console.log("AFTER SORT", standart)

    return standart
  }
  else return standart
}



//*
// "textProfile": [
//           {
//             "type": "number",
//             "min": 0,
//             "max": 100,
//             "model": "age",
//             "label": "Возраст",
//             "value": "",
//           },
//           {
//             "type": "text",
//             "model": "city",
//             "label": "Город",
//             "value": "",
//           },
//           {
//             "type": "tags",
//             "model": "techtags",
//             "label": "Технологии",
//             "value": [],
//           },
//           {
//             "type": "text",
//             "model": "about",
//             "label": "О себе",
//             "value": "",
//             "autogrow": true
//           },
//           {
//             "type": "text",
//             "model": "mydream",
//             "label": "Мечта (идеальный образ будущего)",
//             "value": "",
//             "autogrow": true
//           },

//           {
//             "type": "options",
//             "model": "cmanager",
//             "label": "Комьюнити-менеджер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },
//             ]
//           },
//           {
//             "type": "options",
//             "model": "businessman",
//             "label": "Предприниматель",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },
//             ]
//           },
//           {
//             "type": "options",
//             "model": "investor",
//             "label": "Инвестор",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },
//             ]
//           },
//           {
//             "type": "options",
//             "model": "projectmanager",
//             "label": "Project Manager",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "marketolog",
//             "label": "Маркетолог",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },
//             ]
//           },
          
//           {
//             "type": "options",
//             "model": "productowner",
//             "label": "Product Owner",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "ceo",
//             "label": "CEO",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "cto",
//             "label": "CTO",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "hr",
//             "label": "HR специалист",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "salesman",
//             "label": "Продавец",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "writer",
//             "label": "Копирайтер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },
//             ]
//           },
//           {
//             "type": "options",
//             "model": "frontend-developer",
//             "label": "Фронтенд-разработчик",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "fullstack-developer",
//             "label": "Full-Stack разработчик",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "mobile-developer",
//             "label": "Мобильный разработчик",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "blockchain-developer",
//             "label": "Blockchain разработчик",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "hardware-engineer",
//             "label": "Hardware инженер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "devops",
//             "label": "DevOps",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "security",
//             "label": "Безопасник",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "sysadmin",
//             "label": "Системный администратор",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "dbaseadmin",
//             "label": "Администратор баз данных",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "AQA",
//             "label": "Автоматизатор тестирования (AQA)",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "QA",
//             "label": "Тестировщик (QA)",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "pentester",
//             "label": "Пентестер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "uxuidesigner",
//             "label": "UX/UI дизайнер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "webdesigner",
//             "label": "Веб-дизайнер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "artdesigner",
//             "label": "Графический дизайнер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "gamedesigner",
//             "label": "Гейм-дизайнер",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "techwriter",
//             "label": "Технический писатель",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "sysanalyst",
//             "label": "Системный аналитик",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "dataanalyst",
//             "label": "Аналитик данных (Data Analyst)",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "datascientist",
//             "label": "Специалист по данным (Data Scientist)",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "itarchitect",
//             "label": "IT-Архитектор",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },

//             ]
//           },
//           {
//             "type": "options",
//             "model": "teamlead",
//             "label": "Team Lead",
//             "value": "none",
//             "autogrow": false,
//             "options": [{
//               "label": "Ноль",
//               "value": "none"
//             },{
//               "label": "Junior",
//               "value": "junior"
//             },{
//               "label": "Middle",
//               "value": "middle"
//             },{
//               "label": "Senior",
//               "value": "senior"
//             },
          //     {
          //   "type": "number",
          //   "min": 0,
          //   "max": 100,
          //   "model": "age",
          //   "label": "Возраст",
          //   "value": "",
          // },
          // {
          //   "type": "text",
          //   "model": "city",
          //   "label": "Город",
          //   "value": "",
          // },
//             ]
//           },

