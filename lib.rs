#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod incrementer {
    use chrono::{Datelike, NaiveDateTime, Timelike};
    use ink::storage::traits::StorageLayout;
    use ink::storage::Mapping;

    #[derive(scale::Encode, scale::Decode, Clone, Default, PartialEq)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, Eq, scale_info::TypeInfo, StorageLayout)
    )]
    pub struct Date {
        day: u8,
        month: u8,
        year: u16,
    }

    impl From<NaiveDateTime> for Date {
        fn from(date: NaiveDateTime) -> Date {
            Date {
                day: date.day() as u8,
                month: date.month() as u8,
                year: date.year() as u16,
            }
        }
    }

    #[derive(scale::Encode, scale::Decode, Clone, Default, PartialEq)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, Eq, scale_info::TypeInfo, StorageLayout)
    )]
    pub struct Time {
        hour: u8,
        minute: u8,
    }

    impl From<NaiveDateTime> for Time {
        fn from(date: NaiveDateTime) -> Time {
            Time {
                hour: date.hour() as u8,
                minute: date.minute() as u8,
            }
        }
    }

    #[derive(scale::Encode, scale::Decode, Clone, Default)]
    #[cfg_attr(
        feature = "std",
        derive(Debug, PartialEq, Eq, scale_info::TypeInfo, StorageLayout)
    )]
    pub struct TimeRange {
        start: Option<Time>,
        end: Option<Time>,
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct Incrementer {
        /// Stores a single `bool` value on the storage.
        value: i32,
        ranges: Mapping<(AccountId, Date), TimeRange>,
    }

    impl Incrementer {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new(init_value: i32) -> Self {
            Self {
                value: init_value,
                ranges: Mapping::new(),
            }
        }

        /// Constructor that initializes the `bool` value to `false`.
        ///
        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(0)
        }

        /// Simply returns the current value of our `bool`.
        #[ink(message)]
        pub fn get(&self) -> i32 {
            self.value
        }

        #[ink(message)]
        pub fn inc(&mut self, by: i32) {
            self.value += by;
        }

        fn naive_date_time_with_offset(&self, timezone_minute_offset: i32) -> NaiveDateTime {
            let now: u64 = self.env().block_timestamp();
            let time_seconds = (now as i64) / 1000 - (timezone_minute_offset as i64) * 60;

            NaiveDateTime::from_timestamp_opt(time_seconds, 0).unwrap()
        }

        #[ink(message)]
        pub fn get_todays_time_range(&self, timezone_minute_offset: i32) -> TimeRange {
            let account_id = self.env().account_id();
            let naive_date_time = self.naive_date_time_with_offset(timezone_minute_offset);
            let date = Date::from(naive_date_time);

            self.ranges.get((account_id, date)).unwrap_or(TimeRange {
                start: None,
                end: None,
            })
        }

        fn update_todays_range(&mut self, range: TimeRange, timezone_minute_offset: i32) {
            let account_id = self.env().account_id();
            let naive_date_time = self.naive_date_time_with_offset(timezone_minute_offset);
            let date = Date::from(naive_date_time);

            self.ranges.insert((account_id, date), &range);
        }

        #[ink(message)]
        pub fn start_day(&mut self, timezone_minute_offset: i32) -> bool {
            let todays_time_range = self.get_todays_time_range(timezone_minute_offset);
            let naive_date_time = self.naive_date_time_with_offset(timezone_minute_offset);

            if todays_time_range.start == None && todays_time_range.end == None {
                self.update_todays_range(
                    TimeRange {
                        start: Some(Time::from(naive_date_time)),
                        end: None,
                    },
                    timezone_minute_offset,
                );

                true
            } else {
                false
            }
        }

        #[ink(message)]
        pub fn end_day(&mut self, timezone_minute_offset: i32) -> bool {
            let todays_time_range = self.get_todays_time_range(timezone_minute_offset);
            let naive_date_time = self.naive_date_time_with_offset(timezone_minute_offset);

            if todays_time_range.start != None && todays_time_range.end == None {
                self.update_todays_range(
                    TimeRange {
                        start: todays_time_range.start,
                        end: Some(Time::from(naive_date_time)),
                    },
                    timezone_minute_offset,
                );

                true
            } else {
                false
            }
        }
    }
}
