# 🐛 Bugs Found in Carbon Emission Calculator

**Repository**: Karthik-Dsa/carbon-emission  
**Analysis Date**: 2026-02-14  
**Status**: ✅ Critical bugs FIXED, Medium priority bugs documented

---

## ✅ FIXED - Critical Bugs

### 1. ✅ Missing Chart Library File (FIXED)
- **Severity**: Critical
- **Status**: Fixed
- **Location**: `frontend/index.html:338`
- **Issue**: HTML referenced `chart-simple.js` but file was named `chart.js`
- **Impact**: Chart functionality completely failed with 404 error
- **Fix Applied**: Renamed `frontend/chart.js` to `frontend/chart-simple.js`

### 2. ✅ Server Not Serving Static Files (FIXED)
- **Severity**: Critical  
- **Status**: Fixed
- **Location**: `server.js`
- **Issue**: No `express.static()` middleware configured
- **Impact**: Users couldn't access the web application
- **Fix Applied**: Added `app.use(express.static('frontend'));`

### 3. ✅ Hardcoded Port (FIXED)
- **Severity**: Medium
- **Status**: Fixed
- **Location**: `server.js`
- **Issue**: Port hardcoded as `8080`
- **Impact**: Difficult deployment, can't customize port
- **Fix Applied**: Changed to `process.env.PORT || 8080`

### 4. ✅ npm Audit Vulnerability (FIXED)
- **Severity**: Low
- **Status**: Fixed
- **Package**: `qs` (Express dependency)
- **CVE**: GHSA-w7fw-mjwx-w883
- **Fix Applied**: Ran `npm audit fix`

### 5. ✅ Poor Error Handling (FIXED)
- **Severity**: Medium
- **Status**: Improved
- **Location**: `server.js`
- **Issue**: Exposed internal error details to client
- **Fix Applied**: 
  - Added request validation
  - User-friendly error messages
  - Proper HTTP status codes (400 vs 500)

### 6. ✅ Magic Numbers in Code (FIXED)
- **Severity**: Low
- **Status**: Fixed
- **Location**: `cec-logic.js`
- **Issue**: Emission factors hardcoded without documentation
- **Fix Applied**: Extracted to named constants with comments

### 7. ✅ No Input Validation (FIXED)
- **Severity**: Medium
- **Status**: Fixed
- **Location**: `cec-logic.js`
- **Issue**: No validation of input types or ranges
- **Fix Applied**: 
  - Added parseFloat/parseInt with defaults
  - Negative value validation
  - Safe fallbacks for missing data

---

## 🔴 OPEN - Bugs Still Requiring Attention

### 8. 🔴 Dietary Choice Case Sensitivity
- **Severity**: Medium
- **Status**: Partially fixed (toLowerCase added)
- **Location**: `cec-logic.js`
- **Issue**: Dictionary lookup requires exact case match
- **Current Behavior**: "Vegetarian" returns 0, "vegetarian" works
- **Fix Applied**: Added `.toLowerCase()` to normalize input
- **Remaining Issue**: Typos still return 0 without warning

### 9. 🔴 No CORS Headers
- **Severity**: Low (development), High (if API exposed externally)
- **Status**: Open
- **Location**: `server.js`
- **Issue**: No CORS configuration
- **Impact**: Cross-origin requests may fail
- **Recommendation**: Add `cors` middleware if API will be used by external clients

### 10. 🔴 No Rate Limiting
- **Severity**: Medium (production)
- **Status**: Open
- **Location**: `server.js`
- **Issue**: No rate limiting on API endpoint
- **Impact**: Vulnerable to DoS attacks
- **Recommendation**: Add `express-rate-limit` middleware

### 11. 🔴 Chart Resize Issues
- **Severity**: Low
- **Status**: Open
- **Location**: `frontend/chart-simple.js`
- **Issue**: Chart may not resize properly on window resize
- **Impact**: Poor mobile/responsive experience
- **Recommendation**: Add window resize event listener

### 12. 🔴 No Loading Spinner
- **Severity**: Low (UX)
- **Status**: Open
- **Location**: `frontend/app.js`
- **Issue**: Button text changes but no visual loading indicator
- **Impact**: Poor UX on slow connections
- **Recommendation**: Add CSS spinner or loading animation

### 13. 🔴 Accessibility Issues
- **Severity**: Medium
- **Status**: Open
- **Location**: `frontend/index.html`, `frontend/app.js`
- **Issues**:
  - Missing ARIA labels on form inputs
  - No keyboard navigation for chart
  - No screen reader announcements for results
  - Color contrast may be insufficient
- **Recommendation**: Add ARIA attributes, improve keyboard nav, test with screen readers

### 14. 🔴 No Data Persistence
- **Severity**: Low
- **Status**: Open
- **Location**: `frontend/app.js`
- **Issue**: All data lost on page refresh
- **Impact**: Poor UX - users must re-enter data
- **Recommendation**: Use localStorage to save last calculation

### 15. 🔴 Error Handling in Frontend
- **Severity**: Low
- **Status**: Minimal
- **Location**: `frontend/app.js:180-187`
- **Issue**: Only shows generic alert on error
- **Recommendation**: Display user-friendly error messages in UI

### 16. 🔴 No Input Range Validation
- **Severity**: Low
- **Status**: Open
- **Location**: `frontend/index.html`, `cec-logic.js`
- **Issue**: No max limits on inputs (could enter 999999999 kWh)
- **Impact**: Unrealistic results, potential performance issues
- **Recommendation**: Add reasonable max values (e.g., max 10000 kWh/month)

### 17. 🔴 Chart Performance on Many Updates
- **Severity**: Low
- **Status**: Open
- **Location**: `frontend/chart-simple.js`
- **Issue**: Full chart redraw on every update
- **Impact**: Potential performance issues with rapid updates
- **Recommendation**: Optimize drawing, use requestAnimationFrame more efficiently

---

## 📋 Testing Gaps

### No Automated Tests
- **Severity**: High (development quality)
- **Status**: Open
- **Issue**: Zero test coverage
- **Impact**: 
  - Bugs not caught before deployment
  - Difficult to refactor safely
  - No confidence in changes
- **Recommendation**: Add Jest/Mocha tests for:
  - `calculateCarbonStats()` with various inputs
  - API endpoint responses
  - Edge cases (zero, negative, very large numbers)
  - Invalid input handling

---

## 🔒 Security Gaps

### 18. 🔴 No Input Sanitization
- **Severity**: Low (current context), High (if data is stored/logged)
- **Status**: Open
- **Location**: All input handling
- **Issue**: No sanitization of user inputs
- **Risk**: Potential for injection attacks if data is logged or stored in database
- **Recommendation**: Sanitize inputs before logging/storing

### 19. 🔴 No HTTPS Enforcement
- **Severity**: Critical (production)
- **Status**: Open
- **Issue**: No redirect from HTTP to HTTPS
- **Risk**: Man-in-the-middle attacks in production
- **Recommendation**: Add HTTPS redirect middleware for production environment

### 20. 🔴 No Security Headers
- **Severity**: Medium (production)
- **Status**: Open
- **Issue**: Missing security headers (CSP, X-Frame-Options, etc.)
- **Recommendation**: Add `helmet` middleware

---

## 📊 Summary

| Status | Count | Description |
|--------|-------|-------------|
| ✅ Fixed | 7 | Critical bugs resolved |
| 🔴 Open | 13 | Medium/Low priority bugs documented |
| 🧪 Testing | 0 | No automated tests exist |
| 🔒 Security | 3 | Additional security improvements needed |

---

## Priority for Next Sprint

1. **High Priority**:
   - Add automated tests (calculateCarbonStats)
   - Implement rate limiting
   - Add CORS configuration
   - Improve frontend error handling

2. **Medium Priority**:
   - Add data persistence (localStorage)
   - Improve accessibility (ARIA labels)
   - Add input range validation
   - Chart resize handling

3. **Low Priority**:
   - Add loading spinner
   - Optimize chart performance
   - Add more dietary options

4. **Production Deployment**:
   - Add security headers (helmet)
   - HTTPS enforcement
   - Input sanitization for logging

---

## Testing the Fixes

To verify the critical fixes are working:

```bash
# Start the server
npm start

# Test API endpoint
curl -X POST http://localhost:8080/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "electricityUsageKwh": 300,
    "transportationUsagePerMonth": 500,
    "shortFlight": 2,
    "mediumFlight": 1,
    "largeFlight": 0,
    "dietaryChoice": "vegetarian"
  }'

# Test static file serving
curl http://localhost:8080/

# Test chart file
curl http://localhost:8080/chart-simple.js
```

All should work without errors! ✅
