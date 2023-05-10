#![cfg_attr(not(feature = "std"), no_std)]

#[ink::contract]
mod incrementer {
    use chrono::{Datelike, Days, NaiveDateTime, Timelike, Weekday};
    use ink::storage::traits::StorageLayout;
    use ink::storage::Mapping;

    #[derive(scale::Encode, scale::Decode, Clone, Default, PartialEq, Copy)]
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

    #[derive(scale::Encode, scale::Decode, Clone, Default, PartialEq, Copy)]
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

    #[derive(scale::Encode, scale::Decode, Clone, Default, Copy)]
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
        ranges: Mapping<(AccountId, Date), TimeRange>,
    }

    impl Incrementer {
        /// Constructor that initializes the `bool` value to the given `init_value`.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                ranges: Mapping::new(),
            }
        }

        /// Constructor that initializes the `bool` value to `false`.
        ///
        /// Constructors can delegate to other constructors.
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new()
        }

        fn naive_date_time(&self) -> NaiveDateTime {
            let now: u64 = self.env().block_timestamp();
            let time_seconds = (now as i64) / 1000;

            NaiveDateTime::from_timestamp_opt(time_seconds, 0).unwrap()
        }

        #[ink(message)]
        pub fn get_todays_time_range(&self) -> TimeRange {
            let account_id = self.env().caller();
            let naive_date_time = self.naive_date_time();
            let date = Date::from(naive_date_time);

            self.ranges
                .get((account_id, date))
                .unwrap_or(Default::default())
        }

        #[ink(message)]
        pub fn get_week_time_ranges(
            &self,
            account_id: AccountId,
            week_depth: u64,
        ) -> [TimeRange; 5] {
            let mut naive_date_time = self.naive_date_time();
            naive_date_time = naive_date_time - Days::new(week_depth * 7);

            let mut time_ranges: [TimeRange; 5] = Default::default();

            let mut day_index = 0;

            for _ in 0..7 {
                match naive_date_time.weekday() {
                    Weekday::Sat | Weekday::Sun => {}
                    _ => {
                        let key = (account_id, Date::from(naive_date_time));
                        time_ranges[day_index] = self.ranges.get(key).unwrap_or(Default::default());
                        day_index += 1;
                    }
                }
                naive_date_time = naive_date_time - Days::new(1);
            }

            time_ranges
        }

        #[ink(message)]
        pub fn update_todays_range(&mut self, range: TimeRange) {
            let naive_date_time = self.naive_date_time();
            let date = Date::from(naive_date_time);
            self.update_range(date, range);
        }
        
        #[ink(message)]
        pub fn update_range(&mut self, date: Date, range: TimeRange) {
            let account_id = self.env().caller();
            self.ranges.insert((account_id, date), &range);
        }

        #[ink(message)]
        pub fn start_day(&mut self) -> bool {
            let todays_time_range = self.get_todays_time_range();
            let naive_date_time = self.naive_date_time();

            if todays_time_range.start == None && todays_time_range.end == None {
                self.update_todays_range(TimeRange {
                    start: Some(Time::from(naive_date_time)),
                    end: None,
                });

                true
            } else {
                false
            }
        }

        #[ink(message)]
        pub fn end_day(&mut self) -> bool {
            let todays_time_range = self.get_todays_time_range();
            let naive_date_time = self.naive_date_time();

            if todays_time_range.start != None && todays_time_range.end == None {
                self.update_todays_range(TimeRange {
                    start: todays_time_range.start,
                    end: Some(Time::from(naive_date_time)),
                });

                true
            } else {
                false
            }
        }
    }
}
