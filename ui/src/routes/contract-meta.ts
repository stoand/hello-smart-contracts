export const CONTRACT_META = {
  "source": {
    "hash": "0x77dc993793af1e6e7e887bf6450c4a06ccda7ae9aa17750210efd4118a5adc18",
    "language": "ink! 4.2.0",
    "compiler": "rustc 1.69.0",
    "build_info": {
      "build_mode": "Release",
      "cargo_contract_version": "2.2.1",
      "rust_toolchain": "stable-x86_64-unknown-linux-gnu",
      "wasm_opt_settings": {
        "keep_debug_symbols": false,
        "optimization_passes": "Z"
      }
    }
  },
  "contract": {
    "name": "incrementer",
    "version": "0.1.0",
    "authors": [
      "[your_name] <[your_email]>"
    ]
  },
  "spec": {
    "constructors": [
      {
        "args": [
          {
            "label": "init_value",
            "type": {
              "displayName": [
                "i32"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          "Constructor that initializes the `bool` value to the given `init_value`."
        ],
        "label": "new",
        "payable": false,
        "returnType": {
          "displayName": [
            "ink_primitives",
            "ConstructorResult"
          ],
          "type": 1
        },
        "selector": "0x9bae9d5e"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          "Constructor that initializes the `bool` value to `false`.",
          "",
          "Constructors can delegate to other constructors."
        ],
        "label": "default",
        "payable": false,
        "returnType": {
          "displayName": [
            "ink_primitives",
            "ConstructorResult"
          ],
          "type": 1
        },
        "selector": "0xed4b9d1b"
      }
    ],
    "docs": [],
    "environment": {
      "accountId": {
        "displayName": [
          "AccountId"
        ],
        "type": 5
      },
      "balance": {
        "displayName": [
          "Balance"
        ],
        "type": 8
      },
      "blockNumber": {
        "displayName": [
          "BlockNumber"
        ],
        "type": 11
      },
      "chainExtension": {
        "displayName": [
          "ChainExtension"
        ],
        "type": 12
      },
      "hash": {
        "displayName": [
          "Hash"
        ],
        "type": 9
      },
      "maxEventTopics": 4,
      "timestamp": {
        "displayName": [
          "Timestamp"
        ],
        "type": 10
      }
    },
    "events": [],
    "lang_error": {
      "displayName": [
        "ink",
        "LangError"
      ],
      "type": 3
    },
    "messages": [
      {
        "args": [],
        "default": false,
        "docs": [
          " Simply returns the current value of our `bool`."
        ],
        "label": "get",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 4
        },
        "selector": "0x2f865bd9"
      },
      {
        "args": [
          {
            "label": "by",
            "type": {
              "displayName": [
                "i32"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [],
        "label": "inc",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 1
        },
        "selector": "0x1d32619f"
      }
    ]
  },
  "storage": {
    "root": {
      "layout": {
        "struct": {
          "fields": [
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 0
                }
              },
              "name": "value"
            }
          ],
          "name": "Incrementer"
        }
      },
      "root_key": "0x00000000"
    }
  },
  "types": [
    {
      "id": 0,
      "type": {
        "def": {
          "primitive": "i32"
        }
      }
    },
    {
      "id": 1,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 2
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 3
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 2
          },
          {
            "name": "E",
            "type": 3
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 2,
      "type": {
        "def": {
          "tuple": []
        }
      }
    },
    {
      "id": 3,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 1,
                "name": "CouldNotReadInput"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "LangError"
        ]
      }
    },
    {
      "id": 4,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 0
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 3
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 0
          },
          {
            "name": "E",
            "type": 3
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 5,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 6,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "AccountId"
        ]
      }
    },
    {
      "id": 6,
      "type": {
        "def": {
          "array": {
            "len": 32,
            "type": 7
          }
        }
      }
    },
    {
      "id": 7,
      "type": {
        "def": {
          "primitive": "u8"
        }
      }
    },
    {
      "id": 8,
      "type": {
        "def": {
          "primitive": "u128"
        }
      }
    },
    {
      "id": 9,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 6,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "Hash"
        ]
      }
    },
    {
      "id": 10,
      "type": {
        "def": {
          "primitive": "u64"
        }
      }
    },
    {
      "id": 11,
      "type": {
        "def": {
          "primitive": "u32"
        }
      }
    },
    {
      "id": 12,
      "type": {
        "def": {
          "variant": {}
        },
        "path": [
          "ink_env",
          "types",
          "NoChainExtension"
        ]
      }
    }
  ],
  "version": "4"
};