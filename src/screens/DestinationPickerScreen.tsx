import React, {useRef, useState, useEffect} from 'react';
import {Destination} from "../types/destination";
import MapView, {Marker, Region, PROVIDER_GOOGLE} from 'react-native-maps';
import {Alert, Keyboard, View, Text, Pressable, StyleSheet, ActivityIndicator, TextInput, FlatList} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {fetchPlaceDetails, searchPlaces} from "../services/places.service";
import {PlaceSuggestion} from "../types/places";

type Props = {
    onConfirm: (destination: Destination) => void;
    initialRegion: Region;
}

const SEARCH_MIN_LENGTH = 2;
const SEARCH_DEBOUNCE_DELAY = 350;

const createSessionToken = () => {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const DestinationPickerScreen = ({
    onConfirm,
    initialRegion,
}: Props) => {
    const mapRef = useRef<MapView>(null);
    const requestIdRef = useRef(0);
    const sessionTokenRef = useRef(createSessionToken());
    const manualMapSelectionRef = useRef(false);

    const [region, setRegion] = useState<Region>(initialRegion);
    const [destination, setDestination] = useState<Destination | null>(null);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [mapReady, setMapReady] = useState(false);
    const [pendingRegion, setPendingRegion] = useState<Region | null>(null);

    useEffect(() => {
        const input = query.trim();
        const requestId = ++requestIdRef.current;

        if(input.length < SEARCH_MIN_LENGTH) {
            setSuggestions([]);
            setIsSearching(false);
            setSearchError(null);
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        const timer = setTimeout(async () => {
            try{
                console.log('searchPlaces : ', searchPlaces);
                const results = await searchPlaces(input, sessionTokenRef.current);

                if(requestId !== requestIdRef.current) {
                    return;
                }

                setSuggestions(results)
            }catch(error){
                if(requestId !== requestIdRef.current){
                    return;
                }

                setSuggestions([]);
                setSearchError('Unable to search places. Please try again.');
                console.error('Place search failed: ', error);
            } finally {
                if(requestId === requestIdRef.current){
                    setIsSearching(false);
                }
            }
        }, SEARCH_DEBOUNCE_DELAY);
    }, [query]);

    const handleSearchChange = (text: string) => {
        setQuery(text);
        setDestination(null);
        setSearchError(null);
        manualMapSelectionRef.current = false;
    }

    const handleSelectSuggestion = async (suggestions: PlaceSuggestion) => {
        Keyboard.dismiss();
        setSuggestions([]);
        setQuery(suggestions.description);
        setIsLoadingDetails(true);
        setSearchError(null);
        manualMapSelectionRef.current = false;

        requestIdRef.current += 1;

        try {
            const details = await fetchPlaceDetails(suggestions.placeId, sessionTokenRef.current);

            const selected: Destination = {
                placeId: details.placeId,
                name: details.name,
                latitude: details.latitude,
                longitude: details.longitude,
            }

            setDestination(selected);

            const nextRegion: Region = {
                latitude: details.latitude,
                longitude: details.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }

            setRegion(nextRegion);
            moveMapToDestination(selected);

            sessionTokenRef.current = createSessionToken();
        }catch(error){
            console.error('Place details failed : ', error);
            Alert.alert(
                'Location unavailable',
                'Could not load this place. Please select another result.'
            );
        }finally{
            setIsLoadingDetails(false);
        }
    };

    const handleMapPan = () => {
        manualMapSelectionRef.current = true;
    }

    const handleRegionChangeComplete = (nextRegion: Region) => {
        setRegion(nextRegion);

        if(!manualMapSelectionRef.current) {
            return;
        }

        setDestination({
            name: 'Selected location',
            latitude: nextRegion.latitude,
            longitude: nextRegion.longitude
        });

        setQuery('');
        setSuggestions([]);
        setSearchError(null);
    }

    const handleConfirm = () => {
        if(!destination){
            return;
        }

        onConfirm(destination);
    }

    const moveMapToDestination = (destination: Destination) => {
      const region: Region = {
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setPendingRegion(region);
    };

    useEffect(() => {
      if (!mapReady || !pendingRegion || !mapRef.current) {
        return;
      }

      mapRef.current.animateToRegion(pendingRegion, 500);
      setPendingRegion(null);
    }, [mapReady, pendingRegion]);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                onRegionChangeComplete={handleRegionChangeComplete}
                onPanDrag={handleMapPan}
                onMapReady={() => setMapReady(true)}
                onLayout = {() => setMapReady(true)}
            />

            <View pointerEvents="none" style={styles.centerPin}>
                <Text style={styles.centerPinText}>📍</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <TextInput
                        value={query}
                        onChangeText={handleSearchChange}
                        placeholder="Search destination"
                        placeHolderTextColor ="#777"
                        style={styles.searchInput}
                        returnKeyType="search"
                        autoCorrect={false}
                        accessibilityLabel="Search for a destination"
                    />

                    {isSearching && (
                        <ActivityIndicator
                            style={styles.searchSpinner}
                            size="small"
                            color="#1769e0"
                        />
                    )}
                </View>

                {suggestions.length > 0 && (
                    <FlatList
                        keyboardShouldPersistType="handled"
                        style={styles.searchResults}
                        data={suggestions}
                        keyExtractor={item => item.placeId}
                        renderItem = {({item}) => (
                           <Pressable
                            style={styles.suggestion}
                            onPress={() => handleSelectSuggestion(item)}
                           >
                            <Text style={styles.suggestionTitle}>
                                {item.description}
                            </Text>
                           </Pressable>
                        )}
                    />
                )}

                {searchError && (
                    <Text style={styles.errorText}>{searchError}</Text>
                )}
            </View>

            <View style={styles.bottomPanel}>
                <Text style={styles.title}>Choose your destination</Text>
                <Text style={styles.destinationText}>
                    {isLoadingDetails
                        ? 'Loading place details...'
                        : destination?.name ??
                            'Search for a place or move the map beneath the pin'
                    }
                </Text>

                <Pressable
                    disabled={!destination || isLoadingDetails}
                    style={[
                        styles.confirmButton,
                        (!destination || isLoadingDetails)
                         && styles.disabledButton,
                    ]}
                    onPress={handleConfirm}
                >
                    <Text style={styles.confirmButtonText}>
                        Confirm destination
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    absoluteFill: {
        ...StyleSheet.absoluteFillObject,
    },
    searchContainer: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        zIndex: 2,
    },
    searchBox: {
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        color: '#202124',
        fontSize: 16,
    },
    searchSpinner: {
        marginHorizontal: 14,
    },
    searchResults: {
        maxHeight: 250,
        marginTop: 6,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 5,
    },
    suggestion: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd'
    },
    suggestionTitle: {
      fontSize: 14,
      color: '#202124',
    },
    errorText: {
        marginTop: 8,
        padding: 10,
        backgroundColor: '#fff',
        color: '#b3261e',
        borderRadius: 8,
    },
    centerPin: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -16,
        marginTop: -32,
        zIndex: 1,
    },
    centerPinText: {
      fontSize: 32,
    },
    bottomPanel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 22,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#202124'
    },
    destinationText: {
        marginTop: 8,
        marginBottom: 16,
        color: '#5f6368',
        fontSize: 14,
    },
    confirmButton: {
        height: 52,
        borderRadius: 14,
        backgroundColor: '#1769e0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#aeb6c2'
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    }
})

export default DestinationPickerScreen;